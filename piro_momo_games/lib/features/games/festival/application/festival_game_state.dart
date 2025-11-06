import '../../../../data/models/festival_question.dart';
import '../../../../data/models/game_locale.dart';

class FestivalGameState {
  const FestivalGameState({
    required this.locale,
    required this.deck,
    required this.currentIndex,
    required this.isLoading,
    required this.isAnswered,
    required this.currentOptions,
    this.errorMessage,
    this.selectedOption,
    this.isCorrect,
    this.score = 0,
    this.correctCount = 0,
    this.incorrectCount = 0,
    this.streak = 0,
    this.bestStreak = 0,
  });

  factory FestivalGameState.initial() {
    return const FestivalGameState(
      locale: GameLocale.english,
      deck: <FestivalQuestion>[],
      currentIndex: 0,
      isLoading: true,
      isAnswered: false,
      currentOptions: <String>[],
      score: 0,
      correctCount: 0,
      incorrectCount: 0,
      streak: 0,
      bestStreak: 0,
    );
  }

  final GameLocale locale;
  final List<FestivalQuestion> deck;
  final int currentIndex;
  final bool isLoading;
  final bool isAnswered;
  final List<String> currentOptions;
  final String? errorMessage;
  final String? selectedOption;
  final bool? isCorrect;
  final int score;
  final int correctCount;
  final int incorrectCount;
  final int streak;
  final int bestStreak;

  FestivalQuestion? get currentQuestion {
    if (deck.isEmpty || currentIndex >= deck.length) {
      return null;
    }
    return deck[currentIndex];
  }

  bool get hasError => errorMessage != null;
  bool get isComplete =>
      deck.isNotEmpty && correctCount + incorrectCount >= deck.length;

  FestivalGameState copyWith({
    GameLocale? locale,
    List<FestivalQuestion>? deck,
    int? currentIndex,
    bool? isLoading,
    bool? isAnswered,
    List<String>? currentOptions,
    String? errorMessage,
    String? selectedOption,
    bool? isCorrect,
    int? score,
    int? correctCount,
    int? incorrectCount,
    int? streak,
    int? bestStreak,
    bool clearError = false,
    bool clearSelection = false,
  }) {
    return FestivalGameState(
      locale: locale ?? this.locale,
      deck: deck ?? this.deck,
      currentIndex: currentIndex ?? this.currentIndex,
      isLoading: isLoading ?? this.isLoading,
      isAnswered: isAnswered ?? this.isAnswered,
      currentOptions: currentOptions ?? this.currentOptions,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
      selectedOption: clearSelection
          ? null
          : (selectedOption ?? this.selectedOption),
      isCorrect: clearSelection ? null : (isCorrect ?? this.isCorrect),
      score: score ?? this.score,
      correctCount: correctCount ?? this.correctCount,
      incorrectCount: incorrectCount ?? this.incorrectCount,
      streak: streak ?? this.streak,
      bestStreak: bestStreak ?? this.bestStreak,
    );
  }
}
