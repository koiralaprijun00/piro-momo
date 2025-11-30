import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../data/models/game_locale.dart';
import '../../../home/data/game_definition.dart';
import '../application/festival_game_providers.dart';
import '../application/festival_game_state.dart';
import '../application/festival_game_controller.dart';
import '../../../../data/models/festival_question.dart';
import '../../shared/widgets/game_locale_toggle.dart';
import '../../shared/widgets/header_stat_chip.dart';
import '../../shared/widgets/quiz_option_tile.dart';
import '../widgets/festival_stat_badge.dart';

class FestivalShellScreen extends ConsumerWidget {
  const FestivalShellScreen({super.key});

  static const String routePath = '/games/guess-festival';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final FestivalGameState state = ref.watch(festivalGameControllerProvider);
    final controller = ref.read(festivalGameControllerProvider.notifier);
    return Scaffold(
      body: SafeArea(
        bottom: false,
        child: _FestivalGameContent(state: state, controller: controller),
      ),
    );
  }
}

class _FestivalGameContent extends StatelessWidget {
  const _FestivalGameContent({required this.state, required this.controller});

  final FestivalGameState state;
  final FestivalGameController controller;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;

    if (state.showOnboarding) {
      return _FestivalOnboarding(
        controller: controller,
        isLoading: state.isLoading,
        currentLocale: state.locale,
        onLocaleChange: controller.changeLocale,
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
                            _FestivalStatsPanel(
                              state: state,
                              onBack: () => context.pop(),
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
                              child: _FestivalQuestionCard(
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
                    _PrimaryNextButton(
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

class _FestivalOnboarding extends StatelessWidget {
  const _FestivalOnboarding({
    required this.controller,
    required this.isLoading,
    required this.currentLocale,
    required this.onLocaleChange,
  });

  final FestivalGameController controller;
  final bool isLoading;
  final GameLocale currentLocale;
  final ValueChanged<GameLocale> onLocaleChange;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final game = homeGames.first;

    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            GameLocaleToggle(
              currentLocale: currentLocale,
              onChanged: onLocaleChange,
            ),
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: theme.colorScheme.primary.withOpacity(0.12),
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
              game.description,
              style: theme.textTheme.bodyLarge?.copyWith(
                color: theme.colorScheme.onBackground.withOpacity(0.75),
                height: 1.5,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 28),
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

class _FestivalStatsPanel extends StatelessWidget {
  const _FestivalStatsPanel({
    required this.state,
    required this.onBack,
  });

  final FestivalGameState state;
  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;

    return Container(
      margin: const EdgeInsets.only(top: 4),
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
      decoration: BoxDecoration(
        color: scheme.surface.withOpacity(0.75),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: scheme.outlineVariant.withOpacity(0.25)),
        boxShadow: <BoxShadow>[
          BoxShadow(
            color: scheme.shadow.withOpacity(0.05),
            blurRadius: 16,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        children: <Widget>[
          IconButton(
            onPressed: onBack,
            icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(
                  'Guess the Festival',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w700,
                    color: scheme.onSurface,
                  ),
                ),

              ],
            ),
          ),
          const SizedBox(width: 8),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              HeaderStatChip(
                child: FestivalStatBadge(
                  label: 'Score',
                  value: '${state.score}',
                  icon: Icons.auto_awesome_rounded,
                  compact: true,
                ),
              ),
              const SizedBox(width: 8),
              HeaderStatChip(
                child: FestivalStatBadge(
                  label: 'Streak',
                  value: '${state.streak}',
                  icon: Icons.local_fire_department_rounded,
                  compact: true,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _FestivalQuestionCard extends StatelessWidget {
  const _FestivalQuestionCard({
    super.key,
    required this.state,
    required this.question,
    required this.controller,
    required this.totalAnswered,
  });

  final FestivalGameState state;
  final FestivalQuestion question;
  final FestivalGameController controller;
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
        border: Border.all(color: colorScheme.outlineVariant.withOpacity(0.25)),
        boxShadow: <BoxShadow>[
          BoxShadow(
            color: colorScheme.shadow.withOpacity(0.08),
            blurRadius: 45,
            offset: const Offset(0, 24),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          Text(
            'Question ${totalAnswered + 1} / ${state.deck.length}',
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
          const SizedBox(height: 10),
          Column(
            children: state.currentOptions.asMap().entries.map((entry) {
              final int index = entry.key;
              final String option = entry.value;
              final bool isSelected = state.selectedOption == option;
              final bool isCorrectOption = option == question.name;
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
                  factText: showCorrectState
                      ? _condenseFact(question.fact)
                      : null,
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

String _condenseFact(String fact) {
  final List<String> lines = fact
      .split('\n')
      .map((String line) => line.trim())
      .where((String line) => line.isNotEmpty)
      .toList();
  if (lines.isEmpty) {
    return fact;
  }

  final List<String> selected = lines.take(3).toList();
  String combined = selected.join(' ');
  const int maxChars = 260;
  if (combined.length > maxChars) {
    final int lastSpace = combined.lastIndexOf(' ', maxChars);
    final int cutoff = lastSpace > 0 ? lastSpace : maxChars;
    combined = '${combined.substring(0, cutoff).trim()}…';
  }
  return combined;
}
