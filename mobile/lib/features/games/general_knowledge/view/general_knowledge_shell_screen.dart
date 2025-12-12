import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../home/data/game_definition.dart';
import '../application/general_knowledge_game_providers.dart';
import '../application/general_knowledge_game_state.dart';
import '../application/general_knowledge_game_controller.dart';
import '../../../../data/models/general_knowledge_question.dart';
import '../../shared/widgets/header_stat_chip.dart';
import '../../shared/widgets/quiz_option_tile.dart';
import '../../shared/widgets/glass_header.dart';
import '../../shared/widgets/glass_primary_button.dart';
import '../../festival/widgets/festival_stat_badge.dart';

class GeneralKnowledgeShellScreen extends ConsumerWidget {
  const GeneralKnowledgeShellScreen({super.key});

  static const String routePath = '/games/general-knowledge';
  static const String gameId = 'general-knowledge';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final GeneralKnowledgeGameState state = ref.watch(
      generalKnowledgeGameControllerProvider,
    );
    final controller = ref.read(
      generalKnowledgeGameControllerProvider.notifier,
    );
    return Scaffold(
      body: SafeArea(
        bottom: false,
        child: _GeneralKnowledgeGameContent(
          state: state,
          controller: controller,
        ),
      ),
    );
  }
}

class _GeneralKnowledgeGameContent extends StatelessWidget {
  const _GeneralKnowledgeGameContent({
    required this.state,
    required this.controller,
  });

  final GeneralKnowledgeGameState state;
  final GeneralKnowledgeGameController controller;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;
    final GameDefinition game = homeGames.firstWhere(
      (g) => g.id == 'general-knowledge',
    );

    if (state.showOnboarding) {
      return _GeneralKnowledgeOnboarding(
        controller: controller,
        state: state,
        isLoading: state.isLoading,
        game: game,
      );
    }

    if (state.isLoading && state.deck.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }

    if (state.hasError) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            Icon(Icons.error_outline, size: 48, color: colorScheme.error),
            const SizedBox(height: 16),
            Text(
              state.errorMessage ?? 'Something went wrong',
              style: theme.textTheme.titleMedium?.copyWith(
                color: colorScheme.error,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 20),
            FilledButton.icon(
              onPressed: state.isLoading ? null : controller.loadDeck,
              icon: state.isLoading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                      ),
                    )
                  : const Icon(Icons.refresh_rounded),
              label: Text(state.isLoading ? 'Loading...' : 'Try again'),
            ),
          ],
        ),
      );
    }

    final question = state.currentQuestion;
    if (question == null) {
      return const Center(child: Text('No questions available right now.'));
    }

    if (state.showSummary) {
      return _GeneralKnowledgeSummary(
        state: state,
        onPlayAgain: controller.showCategoryPicker,
        onGoHome: () {
          controller.goHomeAndReset();
          context.go('/');
        },
      );
    }

    final int totalAnswered = state.correctCount + state.incorrectCount;

    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final bool isWide = constraints.maxWidth >= 960;
        final EdgeInsets contentPadding = EdgeInsets.symmetric(
          horizontal: isWide ? 120 : 20,
          vertical: isWide ? 40 : 24,
        );

        return Container(
          width: double.infinity,
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Color(0xFF6366F1), // Indigo
                Color(0xFFA855F7), // Purple
                Color(0xFFEC4899), // Pink
              ],
            ),
          ),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 920),
              child: Padding(
                padding:
                    contentPadding +
                    EdgeInsets.only(
                      bottom: MediaQuery.of(context).padding.bottom + 16,
                    ),
                child: Column(
                  children: <Widget>[
                    Expanded(
                      child: SingleChildScrollView(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: <Widget>[
                            GlassHeader(
                              title: 'General Knowledge',
                              onBack: () => context.pop(),
                              stats: [
                                HeaderStatChip(
                                  child: FestivalStatBadge(
                                    label: 'Score',
                                    value: '${state.score}',
                                    icon: Icons.auto_awesome_rounded,
                                    compact: true,
                                    color: Colors.white,
                                    backgroundColor: Colors.white.withValues(alpha: 0.15),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                HeaderStatChip(
                                  child: FestivalStatBadge(
                                    label: 'Streak',
                                    value: '${state.streak}',
                                    icon: Icons.local_fire_department_rounded,
                                    compact: true,
                                    color: Colors.white,
                                    backgroundColor: Colors.white.withValues(alpha: 0.15),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 20),
                            AnimatedSwitcher(
                              duration: const Duration(milliseconds: 300),
                              switchInCurve: Curves.easeInOut,
                              switchOutCurve: Curves.easeInOut,
                              layoutBuilder:
                                  (
                                    Widget? currentChild,
                                    List<Widget> previousChildren,
                                  ) {
                                    return Stack(
                                      alignment: Alignment.topCenter,
                                      children: <Widget>[
                                        ...previousChildren,
                                        if (currentChild != null) currentChild,
                                      ],
                                    );
                                  },
                              transitionBuilder:
                                  (Widget child, Animation<double> animation) {
                                    final Animation<Offset> slideAnimation =
                                        Tween<Offset>(
                                          begin: const Offset(0, 0.06),
                                          end: Offset.zero,
                                        ).animate(animation);
                                    return FadeTransition(
                                      opacity: animation,
                                      child: SlideTransition(
                                        position: slideAnimation,
                                        child: child,
                                      ),
                                    );
                                  },
                              child: _GeneralKnowledgeQuestionCard(
                                key: ValueKey<String>(
                                  'question-${question.id}',
                                ),
                                state: state,
                                question: question,
                                controller: controller,
                                totalAnswered: totalAnswered,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    GlassPrimaryButton(
                      isEnabled: state.isAnswered,
                      onPressed: state.isAnswered
                          ? controller.nextQuestion
                          : null,
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}

class _GeneralKnowledgeOnboarding extends StatelessWidget {
  const _GeneralKnowledgeOnboarding({
    required this.controller,
    required this.state,
    required this.isLoading,
    required this.game,
  });

  final GeneralKnowledgeGameController controller;
  final GeneralKnowledgeGameState state;
  final bool isLoading;
  final GameDefinition game;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final bool isWide = constraints.maxWidth >= 960;
        final EdgeInsets contentPadding = EdgeInsets.symmetric(
          horizontal: isWide ? 120 : 20,
          vertical: isWide ? 40 : 24,
        );

        return Container(
          width: double.infinity,
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Color(0xFF6366F1), // Indigo
                Color(0xFFA855F7), // Purple
                Color(0xFFEC4899), // Pink
              ],
            ),
          ),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 920),
              child: Padding(
                padding:
                    contentPadding +
                    EdgeInsets.only(
                      bottom: MediaQuery.of(context).padding.bottom + 16,
                    ),
                child: Column(
                  children: <Widget>[
                    Expanded(
                      child: SingleChildScrollView(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: <Widget>[
                            // Left-aligned Content
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  game.title,
                                  style: Theme.of(context).textTheme.displaySmall?.copyWith(
                                    fontWeight: FontWeight.w800,
                                    color: Colors.white,
                                    height: 1.1,
                                    letterSpacing: -0.5,
                                  ),
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  game.description,
                                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                    color: Colors.white.withValues(alpha: 0.9),
                                    height: 1.5,
                                    fontSize: 16,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 32),
                            
                            // Category Selection
                            _OnboardingCategoryChooser(
                              selectedCategory: state.selectedCategory,
                              onCategorySelected: controller.changeCategory,
                            ),
                            const SizedBox(height: 32),

                            // Stats Grid
                            LayoutBuilder(
                              builder: (context, constraints) {
                                return Wrap(
                                  spacing: 12,
                                  runSpacing: 12,
                                  children: [
                                    _GlassStatCard(
                                      icon: Icons.library_books_rounded,
                                      label: 'TOTAL QUESTIONS',
                                      value: '100+',
                                      width: (constraints.maxWidth - 12) / 2,
                                    ),
                                    _GlassStatCard(
                                      icon: Icons.bolt_rounded,
                                      label: 'DIFFICULTY',
                                      value: 'All Levels',
                                      width: (constraints.maxWidth - 12) / 2,
                                    ),
                                  ],
                                );
                              },
                            ),
                            const SizedBox(height: 24),
                          ],
                        ),
                      ),
                    ),
                    // Bottom Buttons
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        TextButton.icon(
                          onPressed: () => context.pop(),
                          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 16),
                          label: const Text('Go Back'),
                          style: TextButton.styleFrom(
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          ),
                        ),
                        FilledButton.icon(
                          onPressed: isLoading ? null : controller.startGame,
                          icon: isLoading 
                              ? const SizedBox(
                                  width: 20, 
                                  height: 20, 
                                  child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)
                                )
                              : const Icon(Icons.play_arrow_rounded),
                          label: Text(isLoading ? 'Loading...' : 'Play Now'),
                          style: FilledButton.styleFrom(
                            backgroundColor: const Color(0xFF1E1B4B), // Dark indigo
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                            textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}

class _OnboardingCategoryChooser extends StatelessWidget {
  const _OnboardingCategoryChooser({
    required this.selectedCategory,
    this.onCategorySelected,
  });

  final String selectedCategory;
  final ValueChanged<String>? onCategorySelected;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final List<String> orderedCategories = [
      'All',
      'Culture',
      'History & Literature',
      'Religion & Mythology',
      'Economy & Politics',
      'Geography',
      'Sports',
      'Science',
      'International',
      'Entertainment',
      'Environment',
      'Jatra of Kathmandu Valley',
    ];
    final Map<String, IconData> iconMap = <String, IconData>{
      'All': Icons.apps_rounded,
      'Culture': Icons.celebration_rounded,
      'History & Literature': Icons.menu_book_rounded,
      'Religion & Mythology': Icons.self_improvement_rounded,
      'Economy & Politics': Icons.account_balance_rounded,
      'Geography': Icons.map_rounded,
      'Sports': Icons.sports_soccer_rounded,
      'Science': Icons.science_rounded,
      'International': Icons.public_rounded,
      'Entertainment': Icons.movie_filter_rounded,
      'Environment': Icons.eco_rounded,
      'Jatra of Kathmandu Valley': Icons.temple_buddhist_rounded,
    };

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text(
          'Pick a category',
          style: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.w700,
            color: Colors.white,
            fontSize: 15,
          ),
        ),
        const SizedBox(height: 16),
        Wrap(
          spacing: 10,
          runSpacing: 10,
          children: orderedCategories.map((String category) {
            final bool isSelected =
                selectedCategory.toLowerCase() == category.toLowerCase();

            // Glassmorphism style for chips
            final Color baseColor = isSelected
                ? const Color(0xFF2563EB) // Blue for selected
                : Colors.white.withValues(alpha: 0.15); // Semi-transparent for unselected

            final Color textColor = Colors.white;

            return InkWell(
              borderRadius: BorderRadius.circular(18),
              onTap: onCategorySelected == null ? null : () => onCategorySelected!(category),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 180),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: baseColor,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(
                    color: isSelected
                        ? Colors.blue.shade300
                        : Colors.white.withValues(alpha: 0.2),
                    width: 1,
                  ),
                  boxShadow: isSelected
                      ? <BoxShadow>[
                          BoxShadow(
                            color: Colors.blue.withValues(alpha: 0.3),
                            blurRadius: 12,
                            offset: const Offset(0, 4),
                          ),
                        ]
                      : const <BoxShadow>[],
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget>[
                    Icon(
                      iconMap[category] ?? Icons.label_rounded,
                      size: 16,
                      color: textColor,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      category,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: theme.textTheme.bodySmall?.copyWith(
                        fontWeight: FontWeight.w600,
                        color: textColor,
                        letterSpacing: 0.1,
                      ),
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}

class _GeneralKnowledgeSummary extends StatelessWidget {
  const _GeneralKnowledgeSummary({
    required this.state,
    required this.onPlayAgain,
    required this.onGoHome,
  });

  final GeneralKnowledgeGameState state;
  final VoidCallback onPlayAgain;
  final VoidCallback onGoHome;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;

    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 40),
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 520),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Icon(
                Icons.emoji_events_rounded,
                size: 64,
                color: colorScheme.primary,
              ),
              const SizedBox(height: 16),
              Text(
                'All questions completed!',
                style: theme.textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.w700,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                'You answered ${state.correctCount} out of ${state.deck.length} correctly.',
                style: theme.textTheme.bodyLarge?.copyWith(
                  color: colorScheme.onSurfaceVariant,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              Row(
                children: <Widget>[
                  Expanded(
                    child: _SummaryTile(
                      label: 'Score',
                      value: '${state.score}',
                      icon: Icons.auto_awesome,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _SummaryTile(
                      label: 'Best streak',
                      value: '${state.bestStreak}',
                      icon: Icons.local_fire_department,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32),
              FilledButton(
                onPressed: onPlayAgain,
                style: FilledButton.styleFrom(
                  minimumSize: const Size.fromHeight(48),
                ),
                child: const Text('Play again'),
              ),
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: onGoHome,
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size.fromHeight(48),
                ),
                child: const Text('Home'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SummaryTile extends StatelessWidget {
  const _SummaryTile({
    required this.label,
    required this.value,
    required this.icon,
  });

  final String label;
  final String value;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: colorScheme.surfaceContainerHighest.withValues(alpha: 0.6),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Icon(icon, color: colorScheme.primary),
          const SizedBox(height: 8),
          Text(
            value,
            style: theme.textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.w700,
            ),
          ),
          Text(
            label,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: colorScheme.onSurfaceVariant,
            ),
          ),
        ],
      ),
    );
  }
}

class _GeneralKnowledgeQuestionCard extends StatelessWidget {
  const _GeneralKnowledgeQuestionCard({
    super.key,
    required this.state,
    required this.question,
    required this.controller,
    required this.totalAnswered,
  });

  final GeneralKnowledgeGameState state;
  final GeneralKnowledgeQuestion question;
  final GeneralKnowledgeGameController controller;
  final int totalAnswered;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;

    return Container(
      padding: const EdgeInsets.fromLTRB(18, 18, 18, 14),
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: colorScheme.outlineVariant.withValues(alpha: 0.35),
        ),
        boxShadow: <BoxShadow>[
          BoxShadow(
            color: colorScheme.shadow.withValues(alpha: 0.08),
            blurRadius: 45,
            offset: const Offset(0, 24),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          Text(
            'Question ${_boundedQuestion(totalAnswered + 1, state.deck.length)} / ${state.deck.length}',
            style: theme.textTheme.labelLarge?.copyWith(
              color: colorScheme.primary,
              letterSpacing: 0.8,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            question.question,
            textAlign: TextAlign.start,
            style: theme.textTheme.titleMedium?.copyWith(
              fontSize: 17,
              fontWeight: FontWeight.w600,
              color: colorScheme.onSurface,
              height: 1.2,
            ),
          ),
          const SizedBox(height: 12),
          Column(
            children: state.currentOptions.asMap().entries.map((entry) {
              final int index = entry.key;
              final String option = entry.value;
              final bool isSelected = state.selectedOption == option;
              final bool isCorrectOption = option == question.correctAnswer;
              final bool showCorrectState = state.isAnswered && isCorrectOption;
              final bool showIncorrectState =
                  state.isAnswered && isSelected && !isCorrectOption;

              return Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: QuizOptionTile(
                  leadingLabel: '${String.fromCharCode(65 + index)}.',
                  label: option,
                  isSelected: !state.isAnswered && isSelected,
                  isDisabled: state.isAnswered,
                  showCorrectState: showCorrectState,
                  showIncorrectState: showIncorrectState,
                  correctLabel: null,
                  incorrectLabel: null,
                  factText: null,
                  onPressed: () => controller.submitGuess(option),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 8),
        ],
      ),
    );
  }
}

int _boundedQuestion(int value, int max) {
  if (max <= 0) {
    return 0;
  }
  if (value < 1) {
    return 1;
  }
  if (value > max) {
    return max;
  }
  return value;
}

class _GlassStatCard extends StatelessWidget {
  const _GlassStatCard({
    required this.icon,
    required this.label,
    required this.value,
    required this.width,
  });

  final IconData icon;
  final String label;
  final String value;
  final double width;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    
    return Container(
      width: width,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.15),
          width: 1,
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              icon,
              color: Colors.white,
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: theme.textTheme.labelSmall?.copyWith(
                    color: Colors.white.withValues(alpha: 0.7),
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.5,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: theme.textTheme.titleSmall?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
