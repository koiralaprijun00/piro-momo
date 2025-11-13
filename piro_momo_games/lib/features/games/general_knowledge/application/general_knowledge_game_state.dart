import '../../../../data/models/general_knowledge_question.dart';
import '../../../../data/models/game_locale.dart';

class GeneralKnowledgeGameState {
  const GeneralKnowledgeGameState({
    required this.locale,
    required this.deck,
    required this.allQuestions,
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
    this.showOnboarding = true,
    this.categories = const <String>[],
    this.selectedCategory = 'All',
    this.showSummary = false,
  });

  factory GeneralKnowledgeGameState.initial() {
    return const GeneralKnowledgeGameState(
      locale: GameLocale.english,
      deck: <GeneralKnowledgeQuestion>[],
      allQuestions: <GeneralKnowledgeQuestion>[],
      currentIndex: 0,
      isLoading: true,
      isAnswered: false,
      currentOptions: <String>[],
      score: 0,
      correctCount: 0,
      incorrectCount: 0,
      streak: 0,
      bestStreak: 0,
      showOnboarding: true,
      categories: <String>[],
      selectedCategory: 'All',
      showSummary: false,
    );
  }

  final GameLocale locale;
  final List<GeneralKnowledgeQuestion> deck;
  final List<GeneralKnowledgeQuestion> allQuestions;
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
  final bool showOnboarding;
  final List<String> categories;
  final String selectedCategory;
  final bool showSummary;

  GeneralKnowledgeQuestion? get currentQuestion {
    if (deck.isEmpty || currentIndex >= deck.length) {
      return null;
    }
    return deck[currentIndex];
  }

  bool get hasError => errorMessage != null;

  GeneralKnowledgeGameState copyWith({
    GameLocale? locale,
    List<GeneralKnowledgeQuestion>? deck,
    List<GeneralKnowledgeQuestion>? allQuestions,
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
    bool? showOnboarding,
    List<String>? categories,
    String? selectedCategory,
    bool? showSummary,
    bool clearError = false,
    bool clearSelection = false,
  }) {
    return GeneralKnowledgeGameState(
      locale: locale ?? this.locale,
      deck: deck ?? this.deck,
      allQuestions: allQuestions ?? this.allQuestions,
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
      showOnboarding: showOnboarding ?? this.showOnboarding,
      categories: categories ?? this.categories,
      selectedCategory: selectedCategory ?? this.selectedCategory,
      showSummary: showSummary ?? this.showSummary,
    );
  }
}
