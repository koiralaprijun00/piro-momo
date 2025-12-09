import 'dart:async';
import 'dart:math' show max;

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/analytics/analytics_service.dart';
import '../../../../core/persistence/cloud_progress_service.dart';
import '../../../../core/persistence/progress_store.dart';
import '../../../../data/models/king_entry.dart';
import '../../../../data/repositories/kings_repository.dart';
import 'kings_game_state.dart';

class KingsGameController extends StateNotifier<KingsGameState> {
  KingsGameController({
    required KingsRepository repository,
    required ProgressStore progressStore,
    required AnalyticsService analytics,
    required CloudProgressService cloudProgress,
    KingsGameState? initialState,
  }) : _repository = repository,
       _progressStore = progressStore,
       _analytics = analytics,
       _cloudProgress = cloudProgress,
       super(initialState ?? KingsGameState.initial());

  final KingsRepository _repository;
  final ProgressStore _progressStore;
  final AnalyticsService _analytics;
  final CloudProgressService _cloudProgress;

  Future<void> loadDeck() async {
    state = state.copyWith(
      isLoading: true,
      clearError: true,
      showSummary: false,
      clearResult: true,
      clearAnswer: true,
      guessedIds: <String>{},
    );

    try {
      final List<KingEntry> kings =
          List<KingEntry>.from(await _repository.loadKings());

      if (kings.isEmpty) {
        state = state.copyWith(
          isLoading: false,
          errorMessage: 'No kings data available.',
        );
        return;
      }

      final int persistedBest = await _progressStore.loadKingsBestStreak();

      state = KingsGameState(
        deck: kings,
        isLoading: false,
        userAnswer: '',
        guessedIds: <String>{},
        score: 0,
        correctCount: 0,
        incorrectCount: 0,
        streak: 0,
        bestStreak: persistedBest,
        showOnboarding: state.showOnboarding,
        showSummary: false,
      );
    } catch (error) {
      state = state.copyWith(isLoading: false, errorMessage: error.toString());
    }
  }

  void updateAnswer(String value) {
    state = state.copyWith(userAnswer: value);
  }

  void submitAnswer() {
    if (state.isLoading || state.showOnboarding) {
      return;
    }

    final String normalizedInput = _normalize(state.userAnswer);
    if (normalizedInput.isEmpty) {
      return;
    }

    KingEntry? matched;
    for (final KingEntry king in state.deck) {
      final bool match = king.aliases.any((String alias) {
        final String aliasFull = _normalize(alias);
        final String aliasFirst = _normalizeFirstToken(alias);
        return normalizedInput == aliasFull || normalizedInput == aliasFirst;
      });
      if (match) {
        matched = king;
        break;
      }
    }

    if (matched == null) {
      state = state.copyWith(
        incorrectCount: state.incorrectCount + 1,
        streak: 0,
        lastGuessCorrect: false,
        lastMessage: 'No king matched that name. Try again.',
        lastMatchedId: null,
        clearAnswer: true,
      );
      _logGuess(correct: false, kingId: null);
      return;
    }

    if (state.guessedIds.contains(matched.id)) {
      state = state.copyWith(
        lastGuessCorrect: null,
        lastMessage: '${matched.name} is already unlocked.',
        lastMatchedId: matched.id,
        clearAnswer: true,
      );
      return;
    }

    final Set<String> guessed = Set<String>.from(state.guessedIds)
      ..add(matched.id);
    final int updatedStreak = state.streak + 1;
    final int updatedBest = max(state.bestStreak, updatedStreak);
    final bool improvedBest = updatedBest > state.bestStreak;

    state = state.copyWith(
      guessedIds: guessed,
      score: state.score + 10,
      correctCount: state.correctCount + 1,
      streak: updatedStreak,
      bestStreak: updatedBest,
      lastGuessCorrect: true,
      lastMessage: 'Unlocked ${matched.name}',
      lastMatchedId: matched.id,
      clearAnswer: true,
    );

    if (improvedBest) {
      unawaited(_progressStore.saveKingsBestStreak(updatedBest));
      unawaited(_cloudProgress.updateProgress(
        gameId: 'kings-of-nepal',
        bestStreak: updatedBest,
        bestScore: state.score + 10,
      ));
    }
    unawaited(_progressStore.maybeSaveKingsBestScore(state.score));
    unawaited(_progressStore.saveLatestGame('kings-of-nepal', state.score));

    _logGuess(correct: true, kingId: matched.id);

    if (guessed.length >= state.deck.length) {
      state = state.copyWith(showSummary: true);
      unawaited(
        _analytics.logEvent(
          'kings_completed',
          parameters: <String, Object?>{
            'score': state.score,
          },
        ),
      );
    }
  }

  void startGame() {
    if (!state.showOnboarding) {
      return;
    }

    if (state.deck.isEmpty) {
      loadDeck().then((_) {
        state = state.copyWith(showOnboarding: false);
      });
    } else {
      state = state.copyWith(showOnboarding: false);
    }
  }

  void restart() {
    state = state.copyWith(
      guessedIds: <String>{},
      showSummary: false,
      score: 0,
      correctCount: 0,
      incorrectCount: 0,
      streak: 0,
      lastGuessCorrect: null,
      lastMessage: null,
      lastMatchedId: null,
      clearAnswer: true,
    );
    loadDeck();
  }

  void goHomeAndReset() {
    state = KingsGameState.initial();
    loadDeck();
  }

  void _logGuess({required bool correct, String? kingId}) {
    _analytics.logEvent(
      'kings_guess',
      parameters: {
        'correct': correct,
        if (kingId != null) 'king_id': kingId,
      },
    );
  }

  void giveUp() {
    // Reveal all kings by adding all IDs to guessedIds
    final Set<String> allKingIds = state.deck.map((king) => king.id).toSet();
    state = state.copyWith(
      guessedIds: allKingIds,
      lastMessage: 'All kings revealed!',
      lastGuessCorrect: null,
      lastMatchedId: null,
    );
    
    _analytics.logEvent('kings_give_up', parameters: {
      'kings_found': state.guessedIds.length,
      'total_kings': state.deck.length,
    });
  }

  String _normalize(String value) {
    return value
        .toLowerCase()
        .replaceAll(RegExp(r'[^a-z0-9\u0900-\u097F]+'), '')
        .trim();
  }

  String _normalizeFirstToken(String value) {
    final String trimmed = value.trim();
    if (trimmed.isEmpty) {
      return '';
    }
    final int spaceIndex = trimmed.indexOf(' ');
    final String firstToken =
        spaceIndex == -1 ? trimmed : trimmed.substring(0, spaceIndex);
    return _normalize(firstToken);
  }
}
