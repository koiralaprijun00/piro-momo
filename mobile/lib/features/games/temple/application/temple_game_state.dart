import '../../../../data/models/temple_entry.dart';

class TempleGameState {
  const TempleGameState({
    required this.deck,
    required this.currentIndex,
    required this.isLoading,
    required this.isAnswered,
    required this.userAnswer,
    required this.score,
    required this.correctCount,
    required this.incorrectCount,
    required this.streak,
    required this.bestStreak,
    required this.showOnboarding,
    this.errorMessage,
    this.isCorrect,
  });

  factory TempleGameState.initial() {
    return const TempleGameState(
      deck: <TempleEntry>[],
      currentIndex: 0,
      isLoading: true,
      isAnswered: false,
      userAnswer: '',
      score: 0,
      correctCount: 0,
      incorrectCount: 0,
      streak: 0,
      bestStreak: 0,
      showOnboarding: true,
    );
  }

  final List<TempleEntry> deck;
  final int currentIndex;
  final bool isLoading;
  final bool isAnswered;
  final String userAnswer;
  final int score;
  final int correctCount;
  final int incorrectCount;
  final int streak;
  final int bestStreak;
  final bool showOnboarding;
  final String? errorMessage;
  final bool? isCorrect;

  TempleEntry? get currentTemple {
    if (deck.isEmpty || currentIndex >= deck.length) {
      return null;
    }
    return deck[currentIndex];
  }

  bool get hasError => errorMessage != null;
  bool get hasWon => score >= 100;

  TempleGameState copyWith({
    List<TempleEntry>? deck,
    int? currentIndex,
    bool? isLoading,
    bool? isAnswered,
    String? userAnswer,
    int? score,
    int? correctCount,
    int? incorrectCount,
    int? streak,
    int? bestStreak,
    bool? showOnboarding,
    String? errorMessage,
    bool? isCorrect,
    bool clearError = false,
    bool clearAnswer = false,
    bool clearResult = false,
  }) {
    return TempleGameState(
      deck: deck ?? this.deck,
      currentIndex: currentIndex ?? this.currentIndex,
      isLoading: isLoading ?? this.isLoading,
      isAnswered: isAnswered ?? this.isAnswered,
      userAnswer: clearAnswer ? '' : (userAnswer ?? this.userAnswer),
      score: score ?? this.score,
      correctCount: correctCount ?? this.correctCount,
      incorrectCount: incorrectCount ?? this.incorrectCount,
      streak: streak ?? this.streak,
      bestStreak: bestStreak ?? this.bestStreak,
      showOnboarding: showOnboarding ?? this.showOnboarding,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
      isCorrect: clearResult ? null : (isCorrect ?? this.isCorrect),
    );
  }
}
