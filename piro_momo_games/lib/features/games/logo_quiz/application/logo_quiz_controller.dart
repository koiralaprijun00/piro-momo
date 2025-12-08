import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/logo_data.dart';
import 'logo_quiz_state.dart';

class LogoQuizController extends StateNotifier<LogoQuizState> {
  Timer? _timer;

  LogoQuizController() : super(const LogoQuizState()) {
    _loadLogos();
  }

  void _loadLogos() {
    state = state.copyWith(isLoading: true);
    try {
      final allLogos = List.of(LogoData.enLogos)..shuffle();
      state = state.copyWith(logos: allLogos, isLoading: false);
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Failed to load logos: $e',
      );
    }
  }

  void startGame() {
    state = state.copyWith(
      showOnboarding: false,
      isTimerActive: true,
      currentIndex: 0,
      score: 0,
      streak: 0,
      correctAnswers: {},
      attempts: {},
      userAnswers: {},
      timeLeft: 300,
      isGameOver: false,
    );
    _startTimer();
  }

  void _startTimer() {
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!state.isTimerActive) return;
      if (state.timeLeft > 0) {
        state = state.copyWith(timeLeft: state.timeLeft - 1);
      } else {
        _endGame();
      }
    });
  }

  void toggleTimer() {
    state = state.copyWith(isTimerActive: !state.isTimerActive);
  }

  void updateAnswer(String answer) {
    final logo = state.currentLogo;
    if (logo == null || state.isGameOver) return;

    final newAnswers = Map<String, String>.from(state.userAnswers);
    newAnswers[logo.id] = answer;
    state = state.copyWith(userAnswers: newAnswers);
  }

  void submitGuess(String answer) {
    if (state.isGameOver) return;
    
    final logo = state.currentLogo;
    if (logo == null) return;
    if (answer.trim().isEmpty) return;
    
    final isCorrect = logo.acceptableAnswers.any(
        (a) => a.toLowerCase().trim() == answer.toLowerCase().trim());

    if (isCorrect) {
      final newCorrectAnswers = Map<String, bool>.from(state.correctAnswers);
      newCorrectAnswers[logo.id] = true;

      state = state.copyWith(
        correctAnswers: newCorrectAnswers,
        score: state.score + 10,
        streak: state.streak + 1,
      );
    } else {
      final newAttempts = Map<String, int>.from(state.attempts);
      newAttempts[logo.id] = (newAttempts[logo.id] ?? 0) + 1;
      state = state.copyWith(attempts: newAttempts, streak: 0);
    }

    // Check if all answered
    if (state.correctAnswers.length == state.logos.length) {
      _endGame();
    }
  }

  void nextLogo() {
    if (state.currentIndex < state.logos.length - 1) {
      state = state.copyWith(currentIndex: state.currentIndex + 1);
    }
  }

  void prevLogo() {
    if (state.currentIndex > 0) {
      state = state.copyWith(currentIndex: state.currentIndex - 1);
    }
  }

  void _endGame() {
    _timer?.cancel();
    state = state.copyWith(isGameOver: true, isTimerActive: false);
  }

  void resetGame() {
    _timer?.cancel();
    final allLogos = List.of(LogoData.enLogos)..shuffle();
    state = LogoQuizState(logos: allLogos, showOnboarding: false);
    startGame();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}
