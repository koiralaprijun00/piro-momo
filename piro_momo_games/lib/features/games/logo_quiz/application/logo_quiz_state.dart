import '../domain/logo_model.dart';

class LogoQuizState {
  final List<Logo> logos;
  final Map<String, int> attempts;
  final Map<String, bool> correctAnswers;
  final Map<String, String> userAnswers;
  final int score;
  final int streak;
  final int currentIndex;
  final int timeLeft;
  final bool isTimerActive;
  final bool isGameOver;
  final bool isLoading;
  final bool showOnboarding;
  final String? errorMessage;

  const LogoQuizState({
    this.logos = const [],
    this.attempts = const {},
    this.correctAnswers = const {},
    this.userAnswers = const {},
    this.score = 0,
    this.streak = 0,
    this.currentIndex = 0,
    this.timeLeft = 300,
    this.isTimerActive = false,
    this.isGameOver = false,
    this.isLoading = false,
    this.showOnboarding = true,
    this.errorMessage,
  });

  Logo? get currentLogo =>
      logos.isNotEmpty && currentIndex < logos.length
          ? logos[currentIndex]
          : null;

  bool get hasError => errorMessage != null;

  LogoQuizState copyWith({
    List<Logo>? logos,
    Map<String, int>? attempts,
    Map<String, bool>? correctAnswers,
    Map<String, String>? userAnswers,
    int? score,
    int? streak,
    int? currentIndex,
    int? timeLeft,
    bool? isTimerActive,
    bool? isGameOver,
    bool? isLoading,
    bool? showOnboarding,
    String? errorMessage,
    bool clearError = false,
  }) {
    return LogoQuizState(
      logos: logos ?? this.logos,
      attempts: attempts ?? this.attempts,
      correctAnswers: correctAnswers ?? this.correctAnswers,
      userAnswers: userAnswers ?? this.userAnswers,
      score: score ?? this.score,
      streak: streak ?? this.streak,
      currentIndex: currentIndex ?? this.currentIndex,
      timeLeft: timeLeft ?? this.timeLeft,
      isTimerActive: isTimerActive ?? this.isTimerActive,
      isGameOver: isGameOver ?? this.isGameOver,
      isLoading: isLoading ?? this.isLoading,
      showOnboarding: showOnboarding ?? this.showOnboarding,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
    );
  }
}
