import 'dart:async';
import 'dart:math';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/analytics/analytics_service.dart';
import '../../../../core/persistence/cloud_progress_service.dart';
import '../../../../core/persistence/progress_store.dart';
import '../../../../data/models/general_knowledge_question.dart';
import '../../../../data/repositories/general_knowledge_repository.dart';
import 'general_knowledge_game_state.dart';

class GeneralKnowledgeGameController
    extends StateNotifier<GeneralKnowledgeGameState> {
  GeneralKnowledgeGameController({
    required GeneralKnowledgeRepository repository,
    required ProgressStore progressStore,
    required AnalyticsService analytics,
    required CloudProgressService cloudProgress,
    GeneralKnowledgeGameState? initialState,
  }) : _repository = repository,
       _progressStore = progressStore,
       _analytics = analytics,
       _cloudProgress = cloudProgress,
       _random = Random(),
       super(initialState ?? GeneralKnowledgeGameState.initial());

  final GeneralKnowledgeRepository _repository;
  final ProgressStore _progressStore;
  final AnalyticsService _analytics;
  final CloudProgressService _cloudProgress;
  final Random _random;

  Future<void> loadDeck() async {
    state = state.copyWith(
      isLoading: true,
      clearError: true,
      clearSelection: true,
    );

    try {
      final List<GeneralKnowledgeQuestion> questions =
          await _repository.loadQuestions();
      if (questions.isEmpty) {
        state = state.copyWith(
          isLoading: false,
          errorMessage: 'No general knowledge questions available.',
        );
        return;
      }

      questions.shuffle(_random);
      final int persistedBest = await _progressStore.loadGkBestStreak();
      final List<String> categories = <String>{
        'All',
        ...questions.map((GeneralKnowledgeQuestion q) => q.category).toSet(),
      }.toList();
      final List<GeneralKnowledgeQuestion> filtered =
          _filterQuestions(questions, 'All');
      if (filtered.isEmpty) {
        state = state.copyWith(
          isLoading: false,
          errorMessage: 'No general knowledge questions available.',
        );
        return;
      }

      state = GeneralKnowledgeGameState(
        deck: filtered,
        allQuestions: questions,
        currentIndex: 0,
        isLoading: false,
        isAnswered: false,
        currentOptions: _buildOptions(filtered.first),
        score: 0,
        correctCount: 0,
        incorrectCount: 0,
        streak: 0,
        bestStreak: persistedBest,
        showOnboarding: state.showOnboarding,
        categories: categories,
        selectedCategory: 'All',
        showSummary: false,
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

    final GeneralKnowledgeQuestion? current = state.currentQuestion;
    if (current == null) {
      return;
    }

    final bool isCorrect = option == current.correctAnswer;
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
      unawaited(_progressStore.saveGkBestStreak(updatedBestStreak));
      unawaited(_cloudProgress.updateProgress(
        gameId: 'general-knowledge',
        bestStreak: updatedBestStreak,
        bestScore: updatedScore,
      ));
    }
    unawaited(_progressStore.maybeSaveGkBestScore(updatedScore));
    unawaited(_progressStore.saveLatestGame('general-knowledge', updatedScore));

    unawaited(
      _analytics.logEvent(
        'general_knowledge_guess',
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
    final List<GeneralKnowledgeQuestion> deck = state.deck;

    if (nextIndex >= deck.length) {
      state = state.copyWith(
        showSummary: true,
        isAnswered: false,
        clearSelection: true,
      );
      return;
    }

    final GeneralKnowledgeQuestion nextQuestion = deck[nextIndex];

    state = state.copyWith(
      deck: deck,
      currentIndex: nextIndex,
      isAnswered: false,
      currentOptions: _buildOptions(nextQuestion),
      clearSelection: true,
    );
  }

  void restart() {
    if (state.deck.isEmpty) {
      loadDeck();
      return;
    }

    final List<GeneralKnowledgeQuestion> deck =
        List<GeneralKnowledgeQuestion>.from(state.deck)..shuffle(_random);

    if (deck.isEmpty) {
      return;
    }

    state = state.copyWith(
      deck: deck,
      currentIndex: 0,
      isLoading: false,
      isAnswered: false,
      currentOptions: _buildOptions(deck.first),
      score: 0,
      correctCount: 0,
      incorrectCount: 0,
      streak: 0,
      clearSelection: true,
    );
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

  void changeCategory(String category) {
    if (state.isLoading ||
        state.allQuestions.isEmpty ||
        category == state.selectedCategory) {
      return;
    }

    final List<GeneralKnowledgeQuestion> filtered = _filterQuestions(
      state.allQuestions,
      category,
    );

    if (filtered.isEmpty) {
      state = state.copyWith(
        selectedCategory: category,
        deck: const <GeneralKnowledgeQuestion>[],
        currentOptions: const <String>[],
        isAnswered: false,
        currentIndex: 0,
        score: 0,
        correctCount: 0,
        incorrectCount: 0,
        streak: 0,
        clearSelection: true,
      );
      return;
    }

    state = state.copyWith(
      selectedCategory: category,
      deck: filtered,
      currentIndex: 0,
      isAnswered: false,
      currentOptions: _buildOptions(filtered.first),
      score: 0,
      correctCount: 0,
      incorrectCount: 0,
      streak: 0,
      clearSelection: true,
      showSummary: false,
    );
  }

  List<String> _buildOptions(GeneralKnowledgeQuestion question) {
    final List<String> options = List<String>.from(question.options);
    options.shuffle(_random);
    return options;
  }

  List<GeneralKnowledgeQuestion> _filterQuestions(
    List<GeneralKnowledgeQuestion> source,
    String category,
  ) {
    final List<GeneralKnowledgeQuestion> filtered = category == 'All'
        ? List<GeneralKnowledgeQuestion>.from(source)
        : source
              .where(
                (GeneralKnowledgeQuestion q) =>
                    q.category.toLowerCase() == category.toLowerCase(),
              )
              .toList();
    filtered.shuffle(_random);
    return filtered;
  }

  void goHomeAndReset() {
    state = state.copyWith(
      showSummary: false,
      isAnswered: false,
      clearSelection: true,
    );
  }

  void showCategoryPicker() {
    state = state.copyWith(
      showOnboarding: true,
      showSummary: false,
      isAnswered: false,
      clearSelection: true,
    );
  }
}
