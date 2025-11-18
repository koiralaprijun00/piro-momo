import '../../../../data/models/game_locale.dart';
import '../../../../data/models/king_entry.dart';

class KingsGameState {
  const KingsGameState({
    required this.locale,
    required this.deck,
    required this.isLoading,
    required this.userAnswer,
    required this.guessedIds,
    this.errorMessage,
    this.score = 0,
    this.correctCount = 0,
    this.incorrectCount = 0,
    this.streak = 0,
    this.bestStreak = 0,
    this.showOnboarding = true,
    this.showSummary = false,
    this.lastGuessCorrect,
    this.lastMessage,
    this.lastMatchedId,
  });

  factory KingsGameState.initial() {
    return const KingsGameState(
      locale: GameLocale.english,
      deck: <KingEntry>[],
      isLoading: true,
      userAnswer: '',
      guessedIds: <String>{},
      score: 0,
      correctCount: 0,
      incorrectCount: 0,
      streak: 0,
      bestStreak: 0,
      showOnboarding: true,
      showSummary: false,
    );
  }

  final GameLocale locale;
  final List<KingEntry> deck;
  final bool isLoading;
  final String userAnswer;
  final Set<String> guessedIds;
  final String? errorMessage;
  final int score;
  final int correctCount;
  final int incorrectCount;
  final int streak;
  final int bestStreak;
  final bool showOnboarding;
  final bool showSummary;
  final bool? lastGuessCorrect;
  final String? lastMessage;
  final String? lastMatchedId;

  bool get hasError => errorMessage != null;
  bool get isComplete => deck.isNotEmpty && guessedIds.length >= deck.length;
  int get remaining => deck.length - guessedIds.length;

  KingsGameState copyWith({
    GameLocale? locale,
    List<KingEntry>? deck,
    bool? isLoading,
    String? userAnswer,
    Set<String>? guessedIds,
    String? errorMessage,
    int? score,
    int? correctCount,
    int? incorrectCount,
    int? streak,
    int? bestStreak,
    bool? showOnboarding,
    bool? showSummary,
    bool? lastGuessCorrect,
    String? lastMessage,
    String? lastMatchedId,
    bool clearError = false,
    bool clearAnswer = false,
    bool clearResult = false,
  }) {
    return KingsGameState(
      locale: locale ?? this.locale,
      deck: deck ?? this.deck,
      isLoading: isLoading ?? this.isLoading,
      userAnswer: clearAnswer ? '' : (userAnswer ?? this.userAnswer),
      guessedIds: guessedIds ?? this.guessedIds,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
      score: score ?? this.score,
      correctCount: correctCount ?? this.correctCount,
      incorrectCount: incorrectCount ?? this.incorrectCount,
      streak: streak ?? this.streak,
      bestStreak: bestStreak ?? this.bestStreak,
      showOnboarding: showOnboarding ?? this.showOnboarding,
      showSummary: showSummary ?? this.showSummary,
      lastGuessCorrect: clearResult ? null : (lastGuessCorrect ?? this.lastGuessCorrect),
      lastMessage: clearResult ? null : (lastMessage ?? this.lastMessage),
      lastMatchedId: clearResult ? null : (lastMatchedId ?? this.lastMatchedId),
    );
  }
}
