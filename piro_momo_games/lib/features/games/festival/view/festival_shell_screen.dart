import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../data/models/game_locale.dart';
import '../../../../core/theme/app_theme.dart';
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

    return Scaffold(
      appBar: AppBar(
        title: const Text('Guess the Festival'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => context.pop(),
        ),
        actions: <Widget>[
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: SegmentedButton<GameLocale>(
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

    final bool isWide = MediaQuery.of(context).size.width >= 960;
    final int totalAnswered = state.correctCount + state.incorrectCount;
    final double accuracy = totalAnswered == 0
        ? 0
        : (state.correctCount / totalAnswered) * 100;

    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final EdgeInsets padding = EdgeInsets.symmetric(
          horizontal: isWide ? 80 : 24,
          vertical: 24,
        );

        return SingleChildScrollView(
          padding:
              padding +
              EdgeInsets.only(
                bottom: MediaQuery.of(context).padding.bottom + 24,
              ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              _HeroHeader(
                state: state,
                accuracy: accuracy,
                controller: controller,
              ),
              const SizedBox(height: 32),
              Card(
                elevation: 8,
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 28,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Text(
                        'Question ${totalAnswered + 1}',
                        style: theme.textTheme.labelLarge?.copyWith(
                          color: colorScheme.primary,
                          letterSpacing: 0.8,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        question.question,
                        style: theme.textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.w700,
                          color: colorScheme.onSurface,
                        ),
                      ),
                      const SizedBox(height: 24),
                      Column(
                        children: state.currentOptions
                            .map(
                              (String option) => Padding(
                                padding: const EdgeInsets.only(bottom: 12),
                                child: FestivalOptionButton(
                                  label: option,
                                  isSelected: state.selectedOption == option,
                                  isCorrectAnswer:
                                      state.isAnswered &&
                                      option == question.name,
                                  isDisabled: state.isAnswered,
                                  onPressed: () =>
                                      controller.submitGuess(option),
                                ),
                              ),
                            )
                            .toList(),
                      ),
                      const SizedBox(height: 16),
                      AnimatedSwitcher(
                        duration: const Duration(milliseconds: 260),
                        switchInCurve: Curves.easeOut,
                        switchOutCurve: Curves.easeIn,
                        child: state.isAnswered
                            ? _FactRevealSection(
                                key: ValueKey<String>('fact-${question.id}'),
                                question: question,
                                isCorrect: state.isCorrect ?? false,
                                controller: controller,
                              )
                            : const SizedBox.shrink(),
                      ),
                    ],
                  ),
                ),
              ),
            ],
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

class _HeroHeader extends StatelessWidget {
  const _HeroHeader({
    required this.state,
    required this.accuracy,
    required this.controller,
  });

  final FestivalGameState state;
  final double accuracy;
  final FestivalGameController controller;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final Gradient? gradient =
        theme.extension<GradientTheme>()?.hero ??
        const LinearGradient(
          colors: <Color>[
            Color(0xFF2563EB),
            Color(0xFFA855F7),
            Color(0xFFF472B6),
          ],
        );

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 32),
      decoration: BoxDecoration(
        gradient: gradient,
        borderRadius: BorderRadius.circular(36),
        boxShadow: const <BoxShadow>[
          BoxShadow(
            color: Color(0x34000000),
            blurRadius: 28,
            offset: Offset(0, 16),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      'Guess the Festival',
                      style: theme.textTheme.headlineMedium?.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.w800,
                        letterSpacing: -0.4,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Match the clue to the celebration and uncover the story behind Nepal’s biggest festivals.',
                      style: theme.textTheme.bodyLarge?.copyWith(
                        color: Colors.white.withOpacity(0.9),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 16),
              CircleAvatar(
                radius: 28,
                backgroundColor: Colors.white.withOpacity(0.18),
                child: Icon(
                  homeGames.first.icon,
                  color: Colors.white,
                  size: 28,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          Wrap(
            spacing: 16,
            runSpacing: 12,
            children: <Widget>[
              FestivalStatBadge(
                label: 'Score',
                value: '${state.score}',
                icon: Icons.auto_awesome_rounded,
                color: Colors.white,
              ),
              FestivalStatBadge(
                label: 'Streak',
                value: state.streak.toString(),
                icon: Icons.local_fire_department_rounded,
                color: Colors.orange.shade200,
              ),
              FestivalStatBadge(
                label: 'Best',
                value: state.bestStreak.toString(),
                icon: Icons.rocket_launch_outlined,
                color: Colors.pink.shade100,
              ),
              FestivalStatBadge(
                label: 'Accuracy',
                value: '${accuracy.toStringAsFixed(0)}%',
                icon: Icons.insights_rounded,
                color: Colors.blue.shade100,
              ),
            ],
          ),
          const SizedBox(height: 20),
          FilledButton.tonalIcon(
            style: FilledButton.styleFrom(
              backgroundColor: Colors.white.withOpacity(0.12),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
            ),
            onPressed: controller.restart,
            icon: const Icon(Icons.refresh_rounded),
            label: const Text('Shuffle deck'),
          ),
        ],
      ),
    );
  }
}

class _FactRevealSection extends StatelessWidget {
  const _FactRevealSection({
    super.key,
    required this.question,
    required this.isCorrect,
    required this.controller,
  });

  final FestivalQuestion question;
  final bool isCorrect;
  final FestivalGameController controller;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;

    final Color pillColor = isCorrect ? colorScheme.primary : colorScheme.error;
    final IconData icon = isCorrect
        ? Icons.celebration_rounded
        : Icons.lightbulb_circle_rounded;

    return Container(
      key: key,
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      decoration: BoxDecoration(
        color: colorScheme.surfaceVariant.withOpacity(0.55),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: (isCorrect ? colorScheme.primary : colorScheme.error)
              .withOpacity(0.35),
          width: 1.4,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Row(
            children: <Widget>[
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: pillColor.withOpacity(0.18),
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget>[
                    Icon(icon, size: 20, color: pillColor),
                    const SizedBox(width: 6),
                    Text(
                      isCorrect ? 'Nice guess!' : 'Here’s the reveal',
                      style: theme.textTheme.labelMedium?.copyWith(
                        color: pillColor,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
              const Spacer(),
              IconButton.filledTonal(
                onPressed: controller.nextQuestion,
                icon: const Icon(Icons.arrow_forward_rounded),
                style: IconButton.styleFrom(
                  backgroundColor: colorScheme.primary.withOpacity(0.85),
                  foregroundColor: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),
          Text(
            question.name,
            style: theme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.w700,
              color: colorScheme.onSurface,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            question.fact,
            style: theme.textTheme.bodyLarge?.copyWith(
              color: colorScheme.onSurface.withOpacity(0.85),
              height: 1.6,
            ),
          ),
        ],
      ),
    );
  }
}
