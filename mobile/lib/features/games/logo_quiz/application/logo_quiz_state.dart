import '../domain/logo_model.dart';
import '../../shared/application/game_phase.dart';

class LogoQuizState {
  /// Wrong guesses allowed per logo. Same rule as the web app.
  static const int maxAttempts = 3;

  final List<Logo> logos;
  final Map<String, int> attempts;
  final Map<String, bool> correctAnswers;
  final Map<String, String> answers;
  final Map<String, String> feedback;
  final int score;
  final int streak;
  final int currentIndex;
  final int timeLeft;
  final bool isTimerActive;
  final bool isGameOver;
  final bool showSummary;
  final bool isLoading;
  final bool showOnboarding;
  final String? errorMessage;

  const LogoQuizState({
    this.logos = const [],
    this.attempts = const {},
    this.correctAnswers = const {},
    this.answers = const {},
    this.feedback = const {},
    this.score = 0,
    this.streak = 0,
    this.currentIndex = 0,
    this.timeLeft = 300,
    this.isTimerActive = false,
    this.isGameOver = false,
    this.showSummary = false,
    this.isLoading = false,
    this.showOnboarding = true,
    this.errorMessage,
  });

  Logo? get currentLogo =>
      logos.isNotEmpty && currentIndex < logos.length
          ? logos[currentIndex]
          : null;

  bool get hasError => errorMessage != null;

  /// Current lifecycle phase (see [GamePhase]).
  GamePhase get phase => resolveGamePhase(
        showOnboarding: showOnboarding,
        isLoading: isLoading,
        hasContent: logos.isNotEmpty,
        hasError: hasError,
        isFinished: isGameOver || showSummary,
        isAnswered: false,
      );

  /// True when the player used all wrong guesses for this logo without solving it.
  bool isOutOfAttempts(String logoId) =>
      correctAnswers[logoId] != true && (attempts[logoId] ?? 0) >= maxAttempts;

  /// A logo is resolved once it is solved or out of attempts; it takes no more guesses.
  bool isResolved(String logoId) =>
      correctAnswers[logoId] == true || isOutOfAttempts(logoId);

  String get currentLogoId => currentLogo?.id ?? '';

  String get currentAnswer =>
      currentLogo == null ? '' : (answers[currentLogo!.id] ?? '');

  LogoQuizState copyWith({
    List<Logo>? logos,
    Map<String, int>? attempts,
    Map<String, bool>? correctAnswers,
    Map<String, String>? answers,
    Map<String, String>? feedback,
    int? score,
    int? streak,
    int? currentIndex,
    int? timeLeft,
    bool? isTimerActive,
    bool? isGameOver,
    bool? showSummary,
    bool? isLoading,
    bool? showOnboarding,
    String? errorMessage,
    bool clearError = false,
  }) {
    return LogoQuizState(
      logos: logos ?? this.logos,
      attempts: attempts ?? this.attempts,
      correctAnswers: correctAnswers ?? this.correctAnswers,
      answers: answers ?? this.answers,
      feedback: feedback ?? this.feedback,
      score: score ?? this.score,
      streak: streak ?? this.streak,
      currentIndex: currentIndex ?? this.currentIndex,
      timeLeft: timeLeft ?? this.timeLeft,
      isTimerActive: isTimerActive ?? this.isTimerActive,
      isGameOver: isGameOver ?? this.isGameOver,
      showSummary: showSummary ?? this.showSummary,
      isLoading: isLoading ?? this.isLoading,
      showOnboarding: showOnboarding ?? this.showOnboarding,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
    );
  }
}
