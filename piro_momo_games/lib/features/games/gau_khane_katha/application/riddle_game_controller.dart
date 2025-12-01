import 'dart:async';
import 'dart:math';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/analytics/analytics_service.dart';
import '../../../../core/persistence/cloud_progress_service.dart';
import '../../../../core/persistence/progress_store.dart';
import '../../../../data/models/riddle_entry.dart';
import '../../../../data/repositories/riddle_repository.dart';
import 'riddle_game_state.dart';

class RiddleGameController extends StateNotifier<RiddleGameState> {
  RiddleGameController({
    required RiddleRepository repository,
    required ProgressStore progressStore,
    required AnalyticsService analytics,
    required CloudProgressService cloudProgress,
    RiddleGameState? initialState,
    Random? random,
  }) : _repository = repository,
       _progressStore = progressStore,
       _analytics = analytics,
       _cloudProgress = cloudProgress,
       _random = random ?? Random(),
       super(initialState ?? RiddleGameState.initial());

  final RiddleRepository _repository;
  final ProgressStore _progressStore;
  final AnalyticsService _analytics;
  final CloudProgressService _cloudProgress;
  final Random _random;

  Future<void> loadDeck() async {
    state = state.copyWith(
      isLoading: true,
      clearError: true,
      submissionStatus: SubmissionStatus.idle,
      userAnswer: '',
      attempts: 0,
      showAnswer: false,
      isCorrect: null,
    );

    try {
      final List<RiddleEntry> riddles =
          List<RiddleEntry>.from(await _repository.loadRiddles());

      if (riddles.isEmpty) {
        state = state.copyWith(
          isLoading: false,
          errorMessage: 'No riddles available.',
        );
        return;
      }

      riddles.shuffle(_random);
      final int persistedBest = await _progressStore.loadRiddleBestStreak();

      state = RiddleGameState(
        deck: riddles,
        currentIndex: 0,
        isLoading: false,
        userAnswer: '',
        attempts: 0,
        maxAttempts: state.maxAttempts,
        showAnswer: false,
        solvedIds: <String>{},
        completedIds: <String>{},
        score: 0,
        streak: 0,
        bestStreak: persistedBest,
        completed: false,
        submissionStatus: SubmissionStatus.idle,
        isCorrect: null,
        showOnboarding: state.showOnboarding,
      );
    } catch (error) {
      state = state.copyWith(isLoading: false, errorMessage: error.toString());
    }
  }

  void updateAnswer(String value) {
    state = state.copyWith(userAnswer: value);
  }

  void submitAnswer() {
    if (state.isLoading || state.showAnswer) {
      return;
    }
    if (state.showOnboarding) {
      return;
    }

    final RiddleEntry? current = state.currentRiddle;
    if (current == null) {
      return;
    }

    final String answer = state.userAnswer.trim();
    if (answer.isEmpty) {
      return;
    }

    final int attemptNumber = state.attempts + 1;
    final bool isCorrect = _matchesAnswer(answer, current);

    bool? outcomeCorrect;

    if (isCorrect) {
      final Set<String> solvedIds = Set<String>.from(state.solvedIds)
        ..add(current.id);
      final Set<String> completedIds = Set<String>.from(state.completedIds)
        ..add(current.id);
      final int earnedPoints =
          max(1, state.maxAttempts - (attemptNumber - 1)) * 10;
      final int updatedStreak = state.streak + 1;
      final int updatedBest = max(state.bestStreak, updatedStreak);
      final bool completed = completedIds.length >= state.deck.length;
      final bool improvedBest = updatedBest > state.bestStreak;

      state = state.copyWith(
        attempts: attemptNumber,
        showAnswer: true,
        isCorrect: true,
        solvedIds: solvedIds,
        completedIds: completedIds,
        score: state.score + earnedPoints,
        streak: updatedStreak,
        bestStreak: updatedBest,
        completed: completed,
      );

      if (improvedBest) {
        unawaited(_progressStore.saveRiddleBestStreak(updatedBest));
        unawaited(_cloudProgress.updateProgress(
          gameId: 'gau-khane-katha',
          bestStreak: updatedBest,
          bestScore: state.score + earnedPoints,
        ));
      }
      unawaited(_progressStore.maybeSaveRiddleBestScore(state.score));
      unawaited(_progressStore.saveLatestGame('gau-khane-katha', state.score));

      outcomeCorrect = true;
    } else {
      final int updatedAttempts = attemptNumber;
      final bool shouldReveal = updatedAttempts >= state.maxAttempts;
      final Set<String> completedIds = shouldReveal
          ? (Set<String>.from(state.completedIds)..add(current.id))
          : state.completedIds;

      state = state.copyWith(
        attempts: updatedAttempts,
        showAnswer: shouldReveal,
        isCorrect: false,
        completedIds: completedIds,
        userAnswer: shouldReveal ? state.userAnswer : '',
        streak: 0,
      );

      outcomeCorrect = false;
    }

    unawaited(
      _analytics.logEvent(
        'riddle_attempt',
        parameters: <String, Object?>{
          'correct': outcomeCorrect ?? false,
          'attempt': attemptNumber,
          'riddle_id': current.id,
        },
      ),
    );
  }

  void revealAnswer() {
    final RiddleEntry? current = state.currentRiddle;
    if (current == null || state.showAnswer || state.showOnboarding) {
      return;
    }

    final Set<String> completedIds = Set<String>.from(state.completedIds)
      ..add(current.id);

    state = state.copyWith(
      showAnswer: true,
      isCorrect: false,
      completedIds: completedIds,
      streak: 0,
    );

    unawaited(
      _analytics.logEvent(
        'riddle_reveal',
        parameters: <String, Object?>{
          'riddle_id': current.id,
        },
      ),
    );
  }

  void nextRiddle() {
    if (state.deck.isEmpty) {
      return;
    }
    if (state.showOnboarding) {
      return;
    }

    if (state.completed) {
      restart();
      return;
    }

    int nextIndex = state.currentIndex;
    for (int i = 1; i <= state.deck.length; i += 1) {
      final int candidateIndex = (state.currentIndex + i) % state.deck.length;
      final String candidateId = state.deck[candidateIndex].id;
      if (!state.completedIds.contains(candidateId)) {
        nextIndex = candidateIndex;
        break;
      }
    }

    state = state.copyWith(
      currentIndex: nextIndex,
      userAnswer: '',
      attempts: 0,
      showAnswer: false,
      isCorrect: null,
    );
  }

  void restart({bool resetBest = false}) {
    if (state.deck.isEmpty) {
      loadDeck();
      return;
    }

    final List<RiddleEntry> deck = List<RiddleEntry>.from(state.deck);
    deck.shuffle(_random);

    state = RiddleGameState(
      deck: deck,
      currentIndex: 0,
      isLoading: false,
      userAnswer: '',
      attempts: 0,
      maxAttempts: state.maxAttempts,
      showAnswer: false,
      solvedIds: <String>{},
      completedIds: <String>{},
      score: 0,
      streak: 0,
      bestStreak: resetBest ? 0 : state.bestStreak,
      completed: false,
      submissionStatus: SubmissionStatus.idle,
      isCorrect: null,
      showOnboarding: state.showOnboarding,
    );
  }

  Future<void> submitRiddleSuggestion({
    required String name,
    required String riddle,
  }) async {
    if (name.trim().isEmpty || riddle.trim().isEmpty) {
      return;
    }

    state = state.copyWith(submissionStatus: SubmissionStatus.submitting);

    try {
      await Future<void>.delayed(const Duration(milliseconds: 800));
      state = state.copyWith(submissionStatus: SubmissionStatus.success);
      unawaited(
        Future<void>.delayed(const Duration(seconds: 3), () {
          state = state.copyWith(submissionStatus: SubmissionStatus.idle);
        }),
      );
    } catch (_) {
      state = state.copyWith(submissionStatus: SubmissionStatus.failure);
      unawaited(
        Future<void>.delayed(const Duration(seconds: 3), () {
          state = state.copyWith(submissionStatus: SubmissionStatus.idle);
        }),
      );
    }
  }

  bool _matchesAnswer(String input, RiddleEntry entry) {
    final String normalizedInput = input.toLowerCase().trim();

    final Set<String> candidates = <String>{
      ..._expandAnswer(entry.answer),
      if (entry.translation != null) ..._expandAnswer(entry.translation!),
    };

    return candidates.contains(normalizedInput);
  }

  Iterable<String> _expandAnswer(String raw) {
    final List<String> splits = raw
        .split(RegExp(r'[/,;|]'))
        .map((String value) => value.toLowerCase().trim())
        .where((String value) => value.isNotEmpty)
        .toList();

    if (splits.isEmpty) {
      return <String>[raw.toLowerCase().trim()];
    }
    return splits;
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
}
