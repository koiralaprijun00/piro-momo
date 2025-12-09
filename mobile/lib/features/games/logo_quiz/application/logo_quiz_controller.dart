import 'dart:async';
import 'dart:math';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../data/logo_data.dart';
import '../domain/logo_model.dart';
import 'logo_quiz_state.dart';

class LogoQuizController extends StateNotifier<LogoQuizState> {
  Timer? _timer;
  final String locale;
  final Random _random;

  LogoQuizController({this.locale = 'en'})
      : _random = Random(),
        super(const LogoQuizState()) {
    _loadLogos();
  }

  void _loadLogos() {
    state = state.copyWith(isLoading: true, clearError: true);

    final List<Logo> allLogos = List<Logo>.from(
      LogoData.getByLocale(locale),
    )..shuffle(_random);

    state = state.copyWith(
      logos: allLogos,
      isLoading: false,
      currentIndex: 0,
      correctAnswers: <String, bool>{},
      attempts: <String, int>{},
      answers: <String, String>{},
      feedback: <String, String>{},
      score: 0,
      streak: 0,
      isGameOver: false,
      showSummary: false,
    );
  }

  void startGame() {
    if (state.logos.isEmpty) {
      _loadLogos();
    }

    final List<Logo> shuffled = List<Logo>.from(state.logos)..shuffle(_random);

    state = state.copyWith(
      logos: shuffled,
      showOnboarding: false,
      isTimerActive: true,
      isGameOver: false,
      showSummary: false,
      currentIndex: 0,
      score: 0,
      streak: 0,
      correctAnswers: <String, bool>{},
      attempts: <String, int>{},
      answers: <String, String>{},
      feedback: <String, String>{},
      timeLeft: 300,
      clearError: true,
    );
    _startTimer();
  }

  void _startTimer() {
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (Timer timer) {
      tick();
    });
  }

  void tick() {
    if (!state.isTimerActive || state.isGameOver) {
      return;
    }
    if (state.timeLeft <= 0) {
      _endGame();
      return;
    }
    state = state.copyWith(timeLeft: state.timeLeft - 1);
  }

  void toggleTimer() {
    state = state.copyWith(isTimerActive: !state.isTimerActive);
  }

  void updateAnswer(String answer) {
    final Logo? logo = state.currentLogo;
    if (logo == null || state.isGameOver) return;

    final Map<String, String> newAnswers = Map<String, String>.from(state.answers);
    newAnswers[logo.id] = answer;
    final Map<String, String> newFeedback = Map<String, String>.from(state.feedback);
    newFeedback.remove(logo.id);

    state = state.copyWith(answers: newAnswers, feedback: newFeedback);
  }

  void checkAnswer([String? providedAnswer]) {
    if (state.isGameOver) return;

    final Logo? logo = state.currentLogo;
    if (logo == null) return;

    final String rawAnswer =
        (providedAnswer ?? state.answers[logo.id] ?? '').trim();
    if (rawAnswer.isEmpty) return;

    final Map<String, String> updatedAnswers =
        Map<String, String>.from(state.answers);
    updatedAnswers[logo.id] = rawAnswer;

    final bool alreadyCorrect = state.correctAnswers[logo.id] == true;
    if (alreadyCorrect) {
      state = state.copyWith(answers: updatedAnswers);
      return;
    }
    final bool isCorrect = _matchesAny(logo, rawAnswer);

    if (isCorrect && !alreadyCorrect) {
      final Map<String, bool> newCorrect = Map<String, bool>.from(state.correctAnswers);
      newCorrect[logo.id] = true;

      final Map<String, String> newFeedback =
          Map<String, String>.from(state.feedback);
      newFeedback[logo.id] = 'Correct!';

      state = state.copyWith(
        correctAnswers: newCorrect,
        feedback: newFeedback,
        answers: updatedAnswers,
        score: state.score + 10,
        streak: state.streak + 1,
      );
    } else if (!isCorrect) {
      final Map<String, int> newAttempts = Map<String, int>.from(state.attempts);
      newAttempts[logo.id] = (newAttempts[logo.id] ?? 0) + 1;

      final Map<String, String> newFeedback =
          Map<String, String>.from(state.feedback);
      newFeedback[logo.id] = 'Incorrect. Try again!';

      state = state.copyWith(
        attempts: newAttempts,
        feedback: newFeedback,
        answers: updatedAnswers,
        streak: 0,
      );
    }

    // All correct? end game
    if (state.correctAnswers.length == state.logos.length ||
        state.timeLeft <= 0) {
      _endGame();
    }
  }

  void nextLogo() {
    if (state.currentIndex < state.logos.length - 1) {
      state = state.copyWith(
        currentIndex: state.currentIndex + 1,
        feedback: Map<String, String>.from(state.feedback)
          ..remove(state.currentLogoId),
      );
    }
  }

  void prevLogo() {
    if (state.currentIndex > 0) {
      state = state.copyWith(
        currentIndex: state.currentIndex - 1,
        feedback: Map<String, String>.from(state.feedback)
          ..remove(state.currentLogoId),
      );
    }
  }

  void _endGame() {
    _timer?.cancel();
    state = state.copyWith(
      isGameOver: true,
      isTimerActive: false,
      showSummary: true,
    );
  }

  void resetGame() {
    _timer?.cancel();
    _loadLogos();
    startGame();
  }

  double blurFor(String logoId) {
    if (state.correctAnswers[logoId] == true) return 0;
    final int attempts = state.attempts[logoId] ?? 0;
    if (attempts <= 0) return 12;
    if (attempts == 1) return 8;
    if (attempts == 2) return 4;
    return 0;
  }

  bool _matchesAny(Logo logo, String answer) {
    final String normalized = _normalize(answer);
    if (_normalize(logo.name) == normalized) return true;
    return logo.acceptableAnswers
        .map(_normalize)
        .any((String candidate) => candidate == normalized);
  }

  String _normalize(String value) {
    return value.toLowerCase().trim();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}
