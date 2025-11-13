import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../data/models/game_locale.dart';
import '../../../home/data/game_definition.dart';
import '../application/general_knowledge_game_providers.dart';
import '../application/general_knowledge_game_state.dart';
import '../application/general_knowledge_game_controller.dart';
import '../../../../data/models/general_knowledge_question.dart';
import '../../shared/widgets/quiz_option_tile.dart';
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
    final ThemeData theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Nepal General Knowledge'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          iconSize: 20,
          padding: const EdgeInsets.all(8),
          visualDensity: VisualDensity.compact,
          onPressed: () => context.pop(),
        ),
        actions: <Widget>[
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: SegmentedButton<GameLocale>(
              style: ButtonStyle(
                visualDensity: VisualDensity.compact,
                padding: const WidgetStatePropertyAll<EdgeInsets>(
                  EdgeInsets.symmetric(horizontal: 8, vertical: 0),
                ),
                textStyle: WidgetStatePropertyAll<TextStyle?>(
                  theme.textTheme.labelMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.4,
                  ),
                ),
              ),
              showSelectedIcon: false,
              segments: const <ButtonSegment<GameLocale>>[
                ButtonSegment<GameLocale>(
                  value: GameLocale.english,
                  label: Text('EN'),
                ),
                ButtonSegment<GameLocale>(
                  value: GameLocale.nepali,
                  label: Text('NP'),
                ),
              ],
              selected: <GameLocale>{state.locale},
              onSelectionChanged: (Set<GameLocale> newSelection) {
                final GameLocale locale = newSelection.first;
                controller.changeLocale(locale);
              },
            ),
          ),
        ],
      ),
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

    if (state.showOnboarding) {
      return _GeneralKnowledgeOnboarding(
        controller: controller,
        isLoading: state.isLoading,
        categories: state.categories,
        selectedCategory: state.selectedCategory,
        onCategorySelect: controller.changeCategory,
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
            FilledButton(
              onPressed: controller.loadDeck,
              child: const Text('Try again'),
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
        final EdgeInsets basePadding = EdgeInsets.symmetric(
          horizontal: isWide ? 120 : 20,
          vertical: isWide ? 40 : 24,
        );

        return Container(
          width: double.infinity,
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: <Color>[
                Color(0xFFF6F3FF),
                Color(0xFFE0F2FE),
                Color(0xFFFFF1F2),
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
          child: Center(
            child: SingleChildScrollView(
              padding:
                  basePadding +
                  EdgeInsets.only(
                    bottom: MediaQuery.of(context).padding.bottom + 32,
                  ),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 920),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: <Widget>[
                    _GeneralKnowledgeStatsPanel(
                      state: state,
                      controller: controller,
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
                        key: ValueKey<String>('question-${question.id}'),
                        state: state,
                        question: question,
                        controller: controller,
                        totalAnswered: totalAnswered,
                      ),
                    ),
                    const SizedBox(height: 20),
                    _PrimaryNextButton(
                      isEnabled: state.isAnswered,
                      onPressed: state.isAnswered
                          ? controller.nextQuestion
                          : null,
                    ),
                    Align(
                      alignment: Alignment.center,
                      child: TextButton(
                        onPressed: state.isLoading
                            ? null
                            : controller.showCategoryPicker,
                        style: ButtonStyle(
                          overlayColor: const WidgetStatePropertyAll(
                            Colors.transparent,
                          ),
                          textStyle: WidgetStateProperty.resolveWith((states) {
                            if (states.contains(WidgetState.hovered)) {
                              return Theme.of(
                                context,
                              ).textTheme.bodyMedium?.copyWith(
                                decoration: TextDecoration.underline,
                              );
                            }
                            return Theme.of(context).textTheme.bodyMedium;
                          }),
                        ),
                        child: const Text('Change category'),
                      ),
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
    required this.isLoading,
    required this.categories,
    required this.selectedCategory,
    required this.onCategorySelect,
  });

  final GeneralKnowledgeGameController controller;
  final bool isLoading;
  final List<String> categories;
  final String selectedCategory;
  final ValueChanged<String> onCategorySelect;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final game = homeGames.firstWhere(
      (GameDefinition game) => game.id == GeneralKnowledgeShellScreen.gameId,
      orElse: () => homeGames.first,
    );

    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: theme.colorScheme.primary.withValues(alpha: 0.12),
                shape: BoxShape.circle,
              ),
              child: Icon(
                game.icon,
                size: 40,
                color: theme.colorScheme.primary,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              game.title,
              style: theme.textTheme.headlineMedium?.copyWith(
                fontWeight: FontWeight.w700,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 12),
            Text(
              'Pick a category to focus on or stay with All. Tap Play whenever you\'re ready.',
              style: theme.textTheme.bodyLarge?.copyWith(
                color: theme.colorScheme.onBackground.withValues(alpha: 0.75),
                height: 1.45,
              ),
              textAlign: TextAlign.center,
            ),
            if (categories.isNotEmpty) ...<Widget>[
              const SizedBox(height: 20),
              _OnboardingCategoryChooser(
                categories: categories,
                selectedCategory: selectedCategory,
                onSelect: isLoading ? null : onCategorySelect,
              ),
            ] else
              const SizedBox(height: 24),
            FilledButton(
              onPressed: isLoading ? null : controller.startGame,
              style: FilledButton.styleFrom(
                padding: const EdgeInsets.symmetric(
                  horizontal: 36,
                  vertical: 16,
                ),
                textStyle: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.3,
                ),
              ),
              child: isLoading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2.5),
                    )
                  : const Text('Play'),
            ),
          ],
        ),
      ),
    );
  }
}

class _OnboardingCategoryChooser extends StatelessWidget {
  const _OnboardingCategoryChooser({
    required this.categories,
    required this.selectedCategory,
    this.onSelect,
  });

  final List<String> categories;
  final String selectedCategory;
  final ValueChanged<String>? onSelect;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text(
          'Pick a category',
          style: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.w700,
            color: colorScheme.onSurface,
          ),
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 10,
          runSpacing: 10,
          children: categories.map((String category) {
            final bool isSelected =
                selectedCategory.toLowerCase() == category.toLowerCase();
            return ChoiceChip(
              label: Text(category),
              selected: isSelected,
              onSelected: onSelect == null
                  ? null
                  : (bool _) => onSelect!(category),
              labelStyle: theme.textTheme.bodyMedium?.copyWith(
                fontWeight: FontWeight.w600,
                color: isSelected ? colorScheme.onPrimary : colorScheme.primary,
              ),
              backgroundColor: colorScheme.primary.withValues(alpha: 0.08),
              selectedColor: colorScheme.primary,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(999),
                side: BorderSide(
                  color: isSelected
                      ? colorScheme.primary
                      : colorScheme.primary.withValues(alpha: 0.25),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}

class _GeneralKnowledgeStatsPanel extends StatelessWidget {
  const _GeneralKnowledgeStatsPanel({
    required this.state,
    required this.controller,
  });

  final GeneralKnowledgeGameState state;
  final GeneralKnowledgeGameController controller;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;

    return Container(
      margin: const EdgeInsets.only(top: 4),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: scheme.surface.withValues(alpha: 0.7),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: scheme.outlineVariant.withValues(alpha: 0.35),
        ),
        boxShadow: <BoxShadow>[
          BoxShadow(
            color: scheme.shadow.withValues(alpha: 0.06),
            blurRadius: 18,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
          final bool isTight = constraints.maxWidth < 380;

          return Row(
            children: <Widget>[
              Expanded(
                child: Wrap(
                  spacing: 10,
                  runSpacing: 8,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: <Widget>[
                    FestivalStatBadge(
                      label: 'Score',
                      value: '${state.score}',
                      icon: Icons.auto_awesome_rounded,
                      compact: true,
                    ),
                    FestivalStatBadge(
                      label: 'Streak',
                      value: '${state.streak}',
                      icon: Icons.local_fire_department_rounded,
                      compact: true,
                    ),
                  ],
                ),
              ),
              Tooltip(
                message: 'Restart',
                child: IconButton.filledTonal(
                  onPressed: controller.restart,
                  icon: const Icon(Icons.shuffle_rounded),
                  iconSize: 18,
                  style: IconButton.styleFrom(
                    padding: EdgeInsets.symmetric(
                      horizontal: isTight ? 10 : 14,
                      vertical: 10,
                    ),
                    shape: const StadiumBorder(),
                  ),
                ),
              ),
            ],
          );
        },
      ),
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
        color: colorScheme.surfaceVariant.withValues(alpha: 0.6),
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
      padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 36),
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(36),
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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Text(
                'Question ${_boundedQuestion(totalAnswered + 1, state.deck.length)} / ${state.deck.length}',
                style: theme.textTheme.labelLarge?.copyWith(
                  color: colorScheme.primary,
                  letterSpacing: 0.8,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: colorScheme.primary.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(
                  question.category,
                  style: theme.textTheme.labelSmall?.copyWith(
                    color: colorScheme.primary,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Text(
            question.question,
            textAlign: TextAlign.start,
            style: theme.textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.w800,
              color: colorScheme.onSurface,
              height: 1.35,
            ),
          ),
          const SizedBox(height: 32),
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
                padding: const EdgeInsets.only(bottom: 14),
                child: QuizOptionTile(
                  leadingLabel: '${String.fromCharCode(65 + index)}.',
                  label: option,
                  isSelected: !state.isAnswered && isSelected,
                  isDisabled: state.isAnswered,
                  showCorrectState: showCorrectState,
                  showIncorrectState: showIncorrectState,
                  correctLabel: showCorrectState
                      ? ((state.isCorrect ?? false)
                            ? 'Correct!'
                            : 'Right answer')
                      : null,
                  incorrectLabel: showIncorrectState ? 'Not quite' : null,
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

class _PrimaryNextButton extends StatelessWidget {
  const _PrimaryNextButton({required this.isEnabled, required this.onPressed});

  final bool isEnabled;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;

    return SizedBox(
      height: 52,
      child: ElevatedButton.icon(
        onPressed: isEnabled ? onPressed : null,
        icon: const Icon(Icons.arrow_forward_rounded),
        label: const Text('Next'),
        style: ElevatedButton.styleFrom(
          elevation: isEnabled ? 3 : 0,
          backgroundColor: isEnabled
              ? colorScheme.primary
              : colorScheme.primary.withValues(alpha: 0.35),
          foregroundColor: isEnabled
              ? colorScheme.onPrimary
              : colorScheme.onPrimary.withValues(alpha: 0.8),
          textStyle: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.w700,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(28),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 26),
        ),
      ),
    );
  }
}
