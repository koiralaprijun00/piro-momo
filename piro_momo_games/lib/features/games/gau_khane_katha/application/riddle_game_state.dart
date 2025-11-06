import '../../../../data/models/game_locale.dart';
import '../../../../data/models/riddle_entry.dart';

enum SubmissionStatus { idle, submitting, success, failure }

class RiddleGameState {
  const RiddleGameState({
    required this.locale,
    required this.deck,
    required this.currentIndex,
    required this.isLoading,
    required this.userAnswer,
    required this.attempts,
    required this.maxAttempts,
    required this.showAnswer,
    required this.solvedIds,
    required this.completedIds,
    required this.score,
    required this.streak,
    required this.bestStreak,
    required this.completed,
    this.errorMessage,
    this.isCorrect,
    this.submissionStatus = SubmissionStatus.idle,
  });

  factory RiddleGameState.initial() {
    return const RiddleGameState(
      locale: GameLocale.english,
      deck: <RiddleEntry>[],
      currentIndex: 0,
      isLoading: true,
      userAnswer: '',
      attempts: 0,
      maxAttempts: 3,
      showAnswer: false,
      solvedIds: <String>{},
      completedIds: <String>{},
      score: 0,
      streak: 0,
      bestStreak: 0,
      completed: false,
      submissionStatus: SubmissionStatus.idle,
    );
  }

  final GameLocale locale;
  final List<RiddleEntry> deck;
  final int currentIndex;
  final bool isLoading;
  final String userAnswer;
  final int attempts;
  final int maxAttempts;
  final bool showAnswer;
  final Set<String> solvedIds;
  final Set<String> completedIds;
  final int score;
  final int streak;
  final int bestStreak;
  final bool completed;
  final String? errorMessage;
  final bool? isCorrect;
  final SubmissionStatus submissionStatus;

  RiddleEntry? get currentRiddle {
    if (deck.isEmpty || currentIndex >= deck.length) {
      return null;
    }
    return deck[currentIndex];
  }

  int get solvedCount => solvedIds.length;
  int get totalCount => deck.length;
  int get completedCount => completedIds.length;
  bool get hasError => errorMessage != null;

  RiddleGameState copyWith({
    GameLocale? locale,
    List<RiddleEntry>? deck,
    int? currentIndex,
    bool? isLoading,
    String? userAnswer,
    int? attempts,
    int? maxAttempts,
    bool? showAnswer,
    Set<String>? solvedIds,
    Set<String>? completedIds,
    int? score,
    int? streak,
    int? bestStreak,
    bool? completed,
    String? errorMessage,
    bool? isCorrect,
    SubmissionStatus? submissionStatus,
    bool clearError = false,
  }) {
    return RiddleGameState(
      locale: locale ?? this.locale,
      deck: deck ?? this.deck,
      currentIndex: currentIndex ?? this.currentIndex,
      isLoading: isLoading ?? this.isLoading,
      userAnswer: userAnswer ?? this.userAnswer,
      attempts: attempts ?? this.attempts,
      maxAttempts: maxAttempts ?? this.maxAttempts,
      showAnswer: showAnswer ?? this.showAnswer,
      solvedIds: solvedIds ?? this.solvedIds,
      completedIds: completedIds ?? this.completedIds,
      score: score ?? this.score,
      streak: streak ?? this.streak,
      bestStreak: bestStreak ?? this.bestStreak,
      completed: completed ?? this.completed,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
      isCorrect: isCorrect ?? this.isCorrect,
      submissionStatus: submissionStatus ?? this.submissionStatus,
    );
  }
}
