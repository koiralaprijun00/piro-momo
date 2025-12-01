import '../../../../data/models/district_entry.dart';

class NameDistrictGameState {
  const NameDistrictGameState({
    required this.deck,
    required this.currentIndex,
    required this.isLoading,
    required this.isAnswered,
    required this.userAnswer,
    required this.currentOptions,
    this.selectedOption,
    this.errorMessage,
    this.isCorrect,
    this.score = 0,
    this.correctCount = 0,
    this.incorrectCount = 0,
    this.streak = 0,
    this.bestStreak = 0,
    this.showOnboarding = true,
  });

  factory NameDistrictGameState.initial() {
    return const NameDistrictGameState(
      deck: <DistrictEntry>[],
      currentIndex: 0,
      isLoading: true,
      isAnswered: false,
      userAnswer: '',
      currentOptions: <String>[],
      score: 0,
      correctCount: 0,
      incorrectCount: 0,
      streak: 0,
      bestStreak: 0,
      showOnboarding: true,
    );
  }

  final List<DistrictEntry> deck;
  final int currentIndex;
  final bool isLoading;
  final bool isAnswered;
  final String userAnswer;
  final List<String> currentOptions;
  final String? selectedOption;
  final String? errorMessage;
  final bool? isCorrect;
  final int score;
  final int correctCount;
  final int incorrectCount;
  final int streak;
  final int bestStreak;
  final bool showOnboarding;

  DistrictEntry? get currentDistrict {
    if (deck.isEmpty || currentIndex >= deck.length) {
      return null;
    }
    return deck[currentIndex];
  }

  bool get hasError => errorMessage != null;

  NameDistrictGameState copyWith({
    List<DistrictEntry>? deck,
    int? currentIndex,
    bool? isLoading,
    bool? isAnswered,
    String? userAnswer,
    List<String>? currentOptions,
    String? selectedOption,
    String? errorMessage,
    bool? isCorrect,
    int? score,
    int? correctCount,
    int? incorrectCount,
    int? streak,
    int? bestStreak,
    bool? showOnboarding,
    bool clearError = false,
    bool clearSelection = false,
    bool clearAnswer = false,
  }) {
    return NameDistrictGameState(
      deck: deck ?? this.deck,
      currentIndex: currentIndex ?? this.currentIndex,
      isLoading: isLoading ?? this.isLoading,
      isAnswered: isAnswered ?? this.isAnswered,
      userAnswer: clearAnswer ? '' : (userAnswer ?? this.userAnswer),
      currentOptions: currentOptions ?? this.currentOptions,
      selectedOption:
          clearSelection ? null : (selectedOption ?? this.selectedOption),
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
      isCorrect: clearSelection ? null : (isCorrect ?? this.isCorrect),
      score: score ?? this.score,
      correctCount: correctCount ?? this.correctCount,
      incorrectCount: incorrectCount ?? this.incorrectCount,
      streak: streak ?? this.streak,
      bestStreak: bestStreak ?? this.bestStreak,
      showOnboarding: showOnboarding ?? this.showOnboarding,
    );
  }
}
