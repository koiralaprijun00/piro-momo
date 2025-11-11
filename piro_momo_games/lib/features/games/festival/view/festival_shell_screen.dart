import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../data/models/game_locale.dart';
import '../../../home/data/game_definition.dart';
import '../application/festival_game_providers.dart';
import '../application/festival_game_state.dart';
import '../application/festival_game_controller.dart';
import '../../../../data/models/festival_question.dart';
import '../widgets/festival_option_button.dart';
import '../widgets/festival_stat_badge.dart';

class FestivalShellScreen extends ConsumerWidget {
  const FestivalShellScreen({super.key});

  static const String routePath = '/games/guess-festival';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final FestivalGameState state = ref.watch(festivalGameControllerProvider);
    final controller = ref.read(festivalGameControllerProvider.notifier);
    final ThemeData theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Guess the Festival'),
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
                    _FestivalStatsPanel(state: state, controller: controller),
                    const SizedBox(height: 28),
                    AnimatedSwitcher(
                      duration: const Duration(milliseconds: 300),
                      switchInCurve: Curves.easeInOut,
                      switchOutCurve: Curves.easeInOut,
                      layoutBuilder: (
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
                      transitionBuilder: (
                        Widget child,
                        Animation<double> animation,
                      ) {
                        final Animation<Offset> slideAnimation = Tween<Offset>(
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
                        key: ValueKey<String>('question-${question.id}'),
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
  });

  final FestivalGameController controller;
  final bool isLoading;

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
  const _FestivalStatsPanel({required this.state, required this.controller});

  final FestivalGameState state;
  final FestivalGameController controller;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;

    return Container(
      margin: const EdgeInsets.only(top: 4),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: scheme.surface.withOpacity(0.7),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: scheme.outlineVariant.withOpacity(0.35)),
        boxShadow: <BoxShadow>[
          BoxShadow(
            color: scheme.shadow.withOpacity(0.06),
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
      padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 36),
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(36),
        border: Border.all(color: colorScheme.outlineVariant.withOpacity(0.35)),
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
            'Question ${totalAnswered + 1}',
            style: theme.textTheme.labelLarge?.copyWith(
              color: colorScheme.primary,
              letterSpacing: 0.8,
            ),
          ),
          const SizedBox(height: 24),
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
              final bool isCorrectOption = option == question.name;
              final bool showCorrectState =
                  state.isAnswered && isCorrectOption;
              final bool showIncorrectState =
                  state.isAnswered && isSelected && !isCorrectOption;

              return Padding(
                padding: const EdgeInsets.only(bottom: 14),
                child: FestivalOptionButton(
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
                  factText: showCorrectState ? question.fact : null,
                  onPressed: () => controller.submitGuess(option),
                ),
              );
            }).toList(),
          ),
          if (state.isAnswered)
            Padding(
              padding: const EdgeInsets.only(top: 16),
              child: Align(
                alignment: Alignment.centerRight,
                child: FilledButton.tonalIcon(
                  onPressed: controller.nextQuestion,
                  icon: const Icon(Icons.arrow_forward_rounded),
                  label: const Text('Next'),
                  style: FilledButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 12,
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
