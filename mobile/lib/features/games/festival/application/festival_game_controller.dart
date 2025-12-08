import 'dart:async';
import 'dart:math';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/analytics/analytics_service.dart';
import '../../../../core/persistence/progress_store.dart';
import '../../../../data/models/festival_question.dart';
import '../../../../data/repositories/festival_repository.dart';
import 'festival_game_state.dart';

class FestivalGameController extends StateNotifier<FestivalGameState> {
  FestivalGameController({
    required FestivalRepository repository,
    required ProgressStore progressStore,
    required AnalyticsService analytics,
    FestivalGameState? initialState,
  }) : _repository = repository,
       _progressStore = progressStore,
       _analytics = analytics,
       _random = Random(),
       super(initialState ?? FestivalGameState.initial());

  final FestivalRepository _repository;
  final ProgressStore _progressStore;
  final AnalyticsService _analytics;
  final Random _random;

  Future<void> loadDeck() async {
    state = state.copyWith(
      isLoading: true,
      clearError: true,
      clearSelection: true,
    );

    try {
      final List<FestivalQuestion> questions = List<FestivalQuestion>.from(
        await _repository.loadQuestions(),
      );
      if (questions.isEmpty) {
        state = state.copyWith(
          isLoading: false,
          errorMessage: 'No festival questions available.',
        );
        return;
      }

      questions.shuffle(_random);
      final int persistedBest = await _progressStore.loadFestivalBestStreak();

      state = FestivalGameState(
        deck: questions,
        currentIndex: 0,
        isLoading: false,
        isAnswered: false,
        currentOptions: _buildOptions(questions, 0),
        score: 0,
        correctCount: 0,
        incorrectCount: 0,
        streak: 0,
        bestStreak: persistedBest,
        showOnboarding: state.showOnboarding,
      );
    } catch (error) {
      state = state.copyWith(isLoading: false, errorMessage: error.toString());
    }
  }

  void submitGuess(String option) {
    if (state.isLoading || state.isAnswered || state.deck.isEmpty) {
      return;
    }
    if (state.showOnboarding) {
      return;
    }

    final FestivalQuestion? current = state.currentQuestion;
    if (current == null) {
      return;
    }

    final bool isCorrect = option == current.name;
    final int updatedScore = state.score + (isCorrect ? 10 : 0);
    final int updatedCorrect = state.correctCount + (isCorrect ? 1 : 0);
    final int updatedIncorrect = state.incorrectCount + (isCorrect ? 0 : 1);
    final int updatedStreak = isCorrect ? state.streak + 1 : 0;
    final int updatedBestStreak = max(state.bestStreak, updatedStreak);
    final bool improvedBest = updatedBestStreak > state.bestStreak;

    state = state.copyWith(
      isAnswered: true,
      selectedOption: option,
      isCorrect: isCorrect,
      score: updatedScore,
      correctCount: updatedCorrect,
      incorrectCount: updatedIncorrect,
      streak: updatedStreak,
      bestStreak: updatedBestStreak,
    );

    if (improvedBest) {
      unawaited(_progressStore.saveFestivalBestStreak(updatedBestStreak));
    }
    unawaited(_progressStore.maybeSaveFestivalBestScore(updatedScore));
    unawaited(_progressStore.saveLatestGame('guess-festival', updatedScore));

    unawaited(
      _analytics.logEvent(
        'festival_guess',
        parameters: <String, Object?>{
          'correct': isCorrect,
          'streak': updatedStreak,
          'question_id': current.id,
        },
      ),
    );
  }

  void nextQuestion() {
    if (state.deck.isEmpty) {
      return;
    }

    int nextIndex = state.currentIndex + 1;
    List<FestivalQuestion> deck = state.deck;

    if (nextIndex >= deck.length) {
      deck = List<FestivalQuestion>.from(deck);
      deck.shuffle(_random);
      nextIndex = 0;
    }

    state = state.copyWith(
      deck: deck,
      currentIndex: nextIndex,
      isAnswered: false,
      currentOptions: _buildOptions(deck, nextIndex),
      clearSelection: true,
    );
  }

  void restart() {
    if (state.deck.isEmpty) {
      loadDeck();
      return;
    }

    final List<FestivalQuestion> deck = List<FestivalQuestion>.from(state.deck)
      ..shuffle(_random);

    state = FestivalGameState(
      deck: deck,
      currentIndex: 0,
      isLoading: false,
      isAnswered: false,
      currentOptions: _buildOptions(deck, 0),
      score: 0,
      correctCount: 0,
      incorrectCount: 0,
      streak: 0,
      bestStreak: state.bestStreak,
      showOnboarding: state.showOnboarding,
    );
  }

  void startGame() {
    if (state.showOnboarding) {
      if (state.deck.isEmpty) {
        loadDeck().then((_) {
          state = state.copyWith(showOnboarding: false);
        });
      } else {
        state = state.copyWith(showOnboarding: false);
      }
    }
  }

  List<String> _buildOptions(List<FestivalQuestion> deck, int activeIndex) {
    if (deck.isEmpty || activeIndex >= deck.length) {
      return const <String>[];
    }

    final String correctAnswer = deck[activeIndex].name;
    final List<String> pool = deck
        .asMap()
        .entries
        .where(
          (MapEntry<int, FestivalQuestion> entry) => entry.key != activeIndex,
        )
        .map((MapEntry<int, FestivalQuestion> entry) => entry.value.name)
        .toList();

    pool.shuffle(_random);
    final List<String> options = <String>[correctAnswer];
    final int needed = min(3, pool.length);
    options.addAll(pool.take(needed));
    options.shuffle(_random);
    return options;
  }
}
