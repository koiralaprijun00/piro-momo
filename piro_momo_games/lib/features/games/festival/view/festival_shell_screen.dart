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
    final double accuracy = totalAnswered == 0
        ? 0
        : (state.correctCount / totalAnswered) * 100;

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
                    _FestivalStatsPanel(
                      state: state,
                      accuracy: accuracy,
                      controller: controller,
                    ),
                    if (totalAnswered == 0) ...<Widget>[
                      const SizedBox(height: 20),
                      const _FestivalIntroBanner(),
                    ],
                    const SizedBox(height: 28),
                    _FestivalQuestionCard(
                      state: state,
                      question: question,
                      controller: controller,
                      totalAnswered: totalAnswered,
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

class _FestivalIntroBanner extends StatelessWidget {
  const _FestivalIntroBanner();

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final game = homeGames.first;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
      decoration: BoxDecoration(
        color: theme.colorScheme.primary.withOpacity(0.08),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(
          color: theme.colorScheme.primary.withOpacity(0.2),
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          CircleAvatar(
            radius: 22,
            backgroundColor: theme.colorScheme.primary.withOpacity(0.12),
            child: Icon(
              game.icon,
              color: theme.colorScheme.primary,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(
                  'Guess the Festival',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w700,
                    color: theme.colorScheme.primary,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'Match the clue to the celebration and uncover the story behind Nepal’s biggest festivals.',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: theme.colorScheme.onSurface.withOpacity(0.8),
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _FestivalStatsPanel extends StatefulWidget {
  const _FestivalStatsPanel({
    required this.state,
    required this.accuracy,
    required this.controller,
  });

  final FestivalGameState state;
  final double accuracy;
  final FestivalGameController controller;

  @override
  State<_FestivalStatsPanel> createState() => _FestivalStatsPanelState();
}

class _FestivalStatsPanelState extends State<_FestivalStatsPanel> {
  bool _expanded = false;

  @override
  void initState() {
    super.initState();
    _expanded = widget.state.isAnswered;
  }

  @override
  void didUpdateWidget(covariant _FestivalStatsPanel oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.state.isAnswered != oldWidget.state.isAnswered) {
      setState(() {
        _expanded = widget.state.isAnswered;
      });
    }
  }

  void _toggleExpanded() {
    setState(() {
      _expanded = !_expanded;
    });
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;

    final List<Widget> statChips = <Widget>[
      FestivalStatBadge(
        label: 'Score',
        value: '${widget.state.score}',
        icon: Icons.auto_awesome_rounded,
        color: colorScheme.primary,
        compact: true,
      ),
      FestivalStatBadge(
        label: 'Streak',
        value: widget.state.streak.toString(),
        icon: Icons.local_fire_department_rounded,
        color: Colors.orange.shade400,
        compact: true,
      ),
      FestivalStatBadge(
        label: 'Best',
        value: widget.state.bestStreak.toString(),
        icon: Icons.rocket_launch_outlined,
        color: Colors.pink.shade400,
        compact: true,
      ),
      FestivalStatBadge(
        label: 'Accuracy',
        value: '${widget.accuracy.toStringAsFixed(0)}%',
        icon: Icons.insights_rounded,
        color: Colors.blue.shade400,
        compact: true,
      ),
    ];

    return AnimatedContainer(
      duration: const Duration(milliseconds: 280),
      curve: Curves.easeOutCubic,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.92),
        borderRadius: BorderRadius.circular(32),
        border: Border.all(
          color: colorScheme.outlineVariant.withOpacity(0.35),
        ),
        boxShadow: const <BoxShadow>[
          BoxShadow(
            color: Color(0x14000000),
            blurRadius: 40,
            offset: Offset(0, 30),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          Row(
            children: <Widget>[
              Text(
                'Stats',
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w700,
                  color: colorScheme.onSurface,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: AnimatedOpacity(
                  duration: const Duration(milliseconds: 200),
                  opacity: _expanded ? 0.7 : 1,
                  child: Text(
                    _expanded
                        ? 'Review your progress before the next clue.'
                        : 'Hidden during play for less distraction.',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: colorScheme.onSurfaceVariant,
                    ),
                  ),
                ),
              ),
              IconButton(
                visualDensity: VisualDensity.compact,
                onPressed: _toggleExpanded,
                icon: Icon(
                  _expanded
                      ? Icons.expand_less_rounded
                      : Icons.expand_more_rounded,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          AnimatedCrossFade(
            firstChild: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  clipBehavior: Clip.none,
                  child: Row(
                    children: statChips
                        .map(
                          (Widget chip) => Padding(
                            padding: const EdgeInsets.only(right: 12),
                            child: chip,
                          ),
                        )
                        .toList(),
                  ),
                ),
                const SizedBox(height: 12),
                Align(
                  alignment: Alignment.centerLeft,
                  child: TextButton.icon(
                    onPressed: widget.controller.restart,
                    style: TextButton.styleFrom(
                      foregroundColor: colorScheme.primary,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 10,
                      ),
                    ),
                    icon: const Icon(Icons.refresh_rounded),
                    label: const Text('Shuffle deck'),
                  ),
                ),
              ],
            ),
            secondChild: const SizedBox.shrink(),
            crossFadeState: _expanded
                ? CrossFadeState.showFirst
                : CrossFadeState.showSecond,
            duration: const Duration(milliseconds: 200),
          ),
        ],
      ),
    );
  }
}

class _FestivalQuestionCard extends StatelessWidget {
  const _FestivalQuestionCard({
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
        border: Border.all(
          color: colorScheme.outlineVariant.withOpacity(0.35),
        ),
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
            textAlign: TextAlign.center,
            style: theme.textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.w800,
              color: colorScheme.onSurface,
              height: 1.35,
            ),
          ),
          const SizedBox(height: 32),
          Column(
            children: state.currentOptions
                .map(
                  (String option) => Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: FestivalOptionButton(
                      label: option,
                      isSelected: state.selectedOption == option,
                      isCorrectAnswer:
                          state.isAnswered && option == question.name,
                      isDisabled: state.isAnswered,
                      onPressed: () => controller.submitGuess(option),
                    ),
                  ),
                )
                .toList(),
          ),
          const SizedBox(height: 12),
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
