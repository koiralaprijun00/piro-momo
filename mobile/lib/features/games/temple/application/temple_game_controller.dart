import 'dart:async';
import 'dart:math';

import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/analytics/analytics_service.dart';
import '../../../../core/persistence/cloud_progress_service.dart';
import '../../../../core/persistence/progress_store.dart';
import '../../../../data/exceptions.dart';
import '../../../../data/models/temple_entry.dart';
import '../../../../data/repositories/temple_repository.dart';
import 'temple_game_state.dart';

class TempleGameController extends StateNotifier<TempleGameState> {
  TempleGameController({
    required TempleRepository repository,
    required ProgressStore progressStore,
    required AnalyticsService analytics,
    required CloudProgressService cloudProgress,
    Random? random,
  })  : _repository = repository,
        _progressStore = progressStore,
        _analytics = analytics,
        _cloudProgress = cloudProgress,
        _random = random ?? Random(),
        super(TempleGameState.initial());

  final TempleRepository _repository;
  final ProgressStore _progressStore;
  final AnalyticsService _analytics;
  final CloudProgressService _cloudProgress;
  final Random _random;

  Future<void> loadDeck() async {
    state = state.copyWith(
      isLoading: true,
      clearError: true,
      clearResult: true,
      clearAnswer: true,
    );
    try {
      final List<TempleEntry> entries =
          List<TempleEntry>.from(await _repository.loadTemples());
      entries.shuffle(_random);
      final int persistedBest = await _progressStore.loadTempleBestStreak();
      state = TempleGameState(
        deck: entries,
        currentIndex: 0,
        isLoading: false,
        isAnswered: false,
        userAnswer: '',
        score: 0,
        correctCount: 0,
        incorrectCount: 0,
        streak: 0,
        bestStreak: persistedBest,
        showOnboarding: state.showOnboarding,
      );
    } on AssetLoadException catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Failed to load temples. Please try again later.',
      );
      debugPrint('TempleGameController: Asset load error: ${e.message}');
    } on DataParseException catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Data format error. Please contact support.',
      );
      debugPrint('TempleGameController: Parse error: ${e.message}');
    } catch (error, stackTrace) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'An unexpected error occurred. Please try again.',
      );
      debugPrint('TempleGameController: Unexpected error: $error');
      debugPrint('Stack trace: $stackTrace');
    }
  }

  void startGame() {
    if (!state.showOnboarding) return;
    if (state.deck.isEmpty) {
      loadDeck().then((_) {
        state = state.copyWith(showOnboarding: false);
      });
    } else {
      state = state.copyWith(showOnboarding: false);
    }
  }

  void updateAnswer(String value) {
    state = state.copyWith(userAnswer: value);
  }

  void submitGuess(String rawGuess) {
    if (state.isLoading || state.isAnswered) return;
    final TempleEntry? current = state.currentTemple;
    if (current == null) return;

    final String normalized = _normalize(rawGuess);
    if (normalized.isEmpty) return;

    final bool isCorrect = _matches(current, normalized);

    final int updatedScore = state.score + (isCorrect ? current.points : 0);
    final int updatedCorrect = state.correctCount + (isCorrect ? 1 : 0);
    final int updatedIncorrect =
        state.incorrectCount + (isCorrect ? 0 : 1);
    final int updatedStreak = isCorrect ? state.streak + 1 : 0;
    final int updatedBest = max(state.bestStreak, updatedStreak);
    final bool improvedBest = updatedBest > state.bestStreak;

    state = state.copyWith(
      isAnswered: true,
      isCorrect: isCorrect,
      score: updatedScore,
      correctCount: updatedCorrect,
      incorrectCount: updatedIncorrect,
      streak: updatedStreak,
      bestStreak: updatedBest,
      clearAnswer: true,
    );

    if (improvedBest) {
      unawaited(_progressStore.saveTempleBestStreak(updatedBest));
      unawaited(_cloudProgress.updateProgress(
        gameId: 'guess-temple',
        bestStreak: updatedBest,
        bestScore: updatedScore,
      ));
    }
    unawaited(_progressStore.maybeSaveTempleBestScore(updatedScore));
    unawaited(_progressStore.saveLatestGame('guess-temple', updatedScore));

    unawaited(_analytics.logEvent(
      'temple_guess',
      parameters: <String, Object?>{
        'correct': isCorrect,
        'temple_id': current.id,
      },
    ));
  }

  void nextTemple() {
    if (state.deck.isEmpty) return;
    int nextIndex = state.currentIndex + 1;
    if (nextIndex >= state.deck.length) {
      nextIndex = 0;
      state = state.copyWith(deck: List<TempleEntry>.from(state.deck)..shuffle(_random));
    }
    state = state.copyWith(
      currentIndex: nextIndex,
      isAnswered: false,
      clearAnswer: true,
      clearResult: true,
    );
  }

  void restart() {
    if (state.deck.isEmpty) {
      loadDeck();
      return;
    }
    final List<TempleEntry> shuffled =
        List<TempleEntry>.from(state.deck)..shuffle(_random);
    state = state.copyWith(
      deck: shuffled,
      currentIndex: 0,
      isAnswered: false,
      score: 0,
      correctCount: 0,
      incorrectCount: 0,
      streak: 0,
      clearAnswer: true,
      clearResult: true,
    );
  }

  void shuffleTemples() {
    if (state.deck.isEmpty) return;
    final List<TempleEntry> shuffled =
        List<TempleEntry>.from(state.deck)..shuffle(_random);
    state = state.copyWith(
      deck: shuffled,
      currentIndex: 0,
      isAnswered: false,
      clearAnswer: true,
      clearResult: true,
    );
  }

  String _normalize(String value) {
    String normalized = value.toLowerCase().trim();
    normalized = normalized
        .replaceAll('pathibara', 'pathivara')
        .replaceAll('pashupatinath', 'pashupati')
        .replaceAll('swayambhunath', 'swayambhu')
        .replaceAll('boudhanath', 'boudha')
        .replaceAll('changunarayan', 'changu')
        .replaceAll(RegExp(r'(temple|mandir|stupa|monastery)'), '')
        .replaceAll(RegExp(r'\\s+'), ' ')
        .trim();
    return normalized;
  }

  bool _matches(TempleEntry entry, String guess) {
    final String name = _normalize(entry.name);
    final List<String> alternatives = entry.alternativeNames
        .map(_normalize)
        .where((String value) => value.isNotEmpty)
        .toList();
    final List<String> acceptable = entry.acceptableAnswers
        .map(_normalize)
        .where((String value) => value.isNotEmpty)
        .toList();

    return guess == name ||
        alternatives.contains(guess) ||
        acceptable.contains(guess);
  }
}
