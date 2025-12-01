import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../data/models/king_entry.dart';
import '../../../home/data/game_definition.dart';
import '../../festival/widgets/festival_stat_badge.dart';
import '../../shared/widgets/header_stat_chip.dart';
import '../application/kings_game_controller.dart';
import '../application/kings_game_providers.dart';
import '../application/kings_game_state.dart';

class KingsShellScreen extends ConsumerStatefulWidget {
  const KingsShellScreen({super.key});

  static const String routePath = '/games/kings-of-nepal';
  static const String gameId = 'kings-of-nepal';

  @override
  ConsumerState<KingsShellScreen> createState() => _KingsShellScreenState();
}

class _KingsShellScreenState extends ConsumerState<KingsShellScreen> {
  late final TextEditingController _answerController;

  @override
  void initState() {
    super.initState();
    _answerController = TextEditingController();
  }

  @override
  void dispose() {
    _answerController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final KingsGameState state = ref.watch(kingsGameControllerProvider);
    final KingsGameController controller = ref.read(
      kingsGameControllerProvider.notifier,
    );

    if (_answerController.text != state.userAnswer) {
      _answerController.value = TextEditingValue(
        text: state.userAnswer,
        selection: TextSelection.collapsed(offset: state.userAnswer.length),
      );
    }

    return Scaffold(
      body: SafeArea(
        bottom: false,
        child: _KingsGameContent(
          state: state,
          controller: controller,
          answerController: _answerController,
        ),
      ),
    );
  }
}

class _KingsGameContent extends StatelessWidget {
  const _KingsGameContent({
    required this.state,
    required this.controller,
    required this.answerController,
  });

  final KingsGameState state;
  final KingsGameController controller;
  final TextEditingController answerController;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;
    final GameDefinition game = homeGames.firstWhere(
      (g) => g.id == 'kings-of-nepal',
    );

    if (state.showOnboarding) {
      return Container(
        color: const Color(0xFFF8F7F4),
        child: _KingsOnboarding(
          controller: controller,
          isLoading: state.isLoading,
          game: game,
        ),
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

    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final bool isWide = constraints.maxWidth >= 960;
        final EdgeInsets contentPadding = EdgeInsets.symmetric(
          horizontal: isWide ? 120 : 20,
          vertical: isWide ? 40 : 24,
        );

        return Container(
          width: double.infinity,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors:
                  game.accentColors
                      .map((Color c) => c.withValues(alpha: 0.15))
                      .toList(),
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
                            _KingsStatsPanel(
                              state: state,
                              onBack: () => context.pop(),
                            ),
                            const SizedBox(height: 20),
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
                              child: _KingsListCard(state: state),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    _KingsInputPanel(
                      state: state,
                      controller: controller,
                      inputController: answerController,
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

class _KingsOnboarding extends StatelessWidget {
  const _KingsOnboarding({
    required this.controller,
    required this.isLoading,
    required this.game,
  });

  final KingsGameController controller;
  final bool isLoading;
  final GameDefinition game;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 48),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
                border: Border.all(
                  color: const Color(0xFFE5E5E5),
                  width: 1,
                ),
              ),
              child: Image.asset(
                game.assetPath,
                width: 64,
                height: 64,
                color: game.accentColors.first,
              ),
            ),
            const SizedBox(height: 32),
            Text(
              game.title,
              style: theme.textTheme.headlineLarge?.copyWith(
                fontWeight: FontWeight.w800,
                color: const Color(0xFF1A1A1A),
                letterSpacing: -0.5,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            Text(
              game.description,
              style: theme.textTheme.bodyLarge?.copyWith(
                color: const Color(0xFF6B6B6B),
                height: 1.6,
                fontSize: 16,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 40),
            FilledButton(
              onPressed: isLoading ? null : controller.startGame,
              style: FilledButton.styleFrom(
                backgroundColor: const Color(0xFF2D2D2D),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(
                  horizontal: 48,
                  vertical: 20,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                elevation: 0,
                textStyle: theme.textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.5,
                ),
              ),
              child: isLoading
                  ? const SizedBox(
                      width: 24,
                      height: 24,
                      child: CircularProgressIndicator(
                        strokeWidth: 3,
                        color: Colors.white,
                      ),
                    )
                  : const Text('Play'),
            ),
          ],
        ),
      ),
    );
  }
}

class _KingsStatsPanel extends StatelessWidget {
  const _KingsStatsPanel({required this.state, required this.onBack});

  final KingsGameState state;
  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
      decoration: BoxDecoration(
        color: scheme.surface.withValues(alpha: 0.75),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: scheme.outlineVariant.withValues(alpha: 0.25),
        ),
        boxShadow: <BoxShadow>[
          BoxShadow(
            color: scheme.shadow.withValues(alpha: 0.05),
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
                  'Kings of Nepal',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w700,
                    color: scheme.onSurface,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Unlocked ${state.guessedIds.length} of ${state.deck.length}',
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: scheme.onSurfaceVariant,
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
                  label: 'Found',
                  value: '${state.guessedIds.length}/${state.deck.length}',
                  icon: Icons.fact_check_rounded,
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

class _KingsInputPanel extends StatelessWidget {
  const _KingsInputPanel({
    required this.state,
    required this.controller,
    required this.inputController,
  });

  final KingsGameState state;
  final KingsGameController controller;
  final TextEditingController inputController;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;
    final bool canSubmit = state.userAnswer.trim().isNotEmpty;
    final double progress = state.deck.isEmpty
        ? 0
        : state.guessedIds.length / state.deck.length;

    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: <Color>[Color(0xFF7C3AED), Color(0xFFA855F7)],
        ),
        borderRadius: BorderRadius.circular(28),
      ),
      child: Container(
        margin: const EdgeInsets.all(1.2),
        padding: const EdgeInsets.fromLTRB(18, 18, 18, 16),
        decoration: BoxDecoration(
          color: colorScheme.surface,
          borderRadius: BorderRadius.circular(26),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(
              'Name the Kings of Nepal',
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w800,
                color: colorScheme.onSurface,
              ),
            ),
            const SizedBox(height: 6),
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: progress,
                minHeight: 6,
                backgroundColor: colorScheme.surfaceVariant.withValues(alpha: 0.4),
              ),
            ),
            const SizedBox(height: 14),
            Row(
              children: <Widget>[
                Text(
                  '${state.guessedIds.length} found',
                  style: theme.textTheme.labelLarge?.copyWith(
                    color: colorScheme.primary,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(width: 10),
                Text(
                  '${state.remaining} to go',
                  style: theme.textTheme.labelLarge?.copyWith(
                    color: colorScheme.onSurfaceVariant,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            TextField(
              controller: inputController,
              onChanged: controller.updateAnswer,
              onSubmitted: (_) {
                if (state.userAnswer.trim().isNotEmpty) {
                  controller.submitAnswer();
                }
              },
              textInputAction: TextInputAction.done,
              decoration: InputDecoration(
                hintText: "Type a king's name…",
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
                suffixIcon: IconButton(
                  icon: const Icon(Icons.arrow_circle_up_rounded, size: 28),
                  color: colorScheme.primary,
                  onPressed: canSubmit ? controller.submitAnswer : null,
                ),
              ),
            ),
            const SizedBox(height: 10),
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 220),
              child: state.lastMessage == null
                  ? const SizedBox.shrink()
                  : Container(
                      key: ValueKey<String>('feedback-${state.lastMessage}'),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        color: (state.lastGuessCorrect ?? false)
                            ? const Color(0xFFDFF7E3)
                            : const Color(0xFFF5F5F5),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Text(
                        state.lastMessage!,
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: (state.lastGuessCorrect ?? false)
                              ? const Color(0xFF166534)
                              : colorScheme.onSurfaceVariant,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

class _KingsListCard extends StatelessWidget {
  const _KingsListCard({required this.state});

  final KingsGameState state;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;

    return Container(
      decoration: BoxDecoration(
        color: scheme.surface,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(
          color: scheme.outlineVariant.withValues(alpha: 0.25),
        ),
        boxShadow: <BoxShadow>[
          BoxShadow(
            color: scheme.shadow.withValues(alpha: 0.08),
            blurRadius: 45,
            offset: const Offset(0, 24),
          ),
        ],
      ),
      child: Column(
        children: <Widget>[
          const _KingsTableHeader(),
          const Divider(height: 1),
          Expanded(
            child: ListView.separated(
              padding: EdgeInsets.zero,
              itemCount: state.deck.length,
              separatorBuilder: (_, __) =>
                  Divider(height: 1, color: scheme.outline.withValues(alpha: 0.1)),
              itemBuilder: (BuildContext context, int index) {
                final KingEntry king = state.deck[index];
                final bool guessed = state.guessedIds.contains(king.id);
                final bool highlight =
                    guessed && state.lastMatchedId == king.id;
                return _KingListRow(
                  index: index,
                  king: king,
                  guessed: guessed,
                  highlight: highlight,
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _KingsTableHeader extends StatelessWidget {
  const _KingsTableHeader();

  @override
  Widget build(BuildContext context) {
    final TextStyle? labelStyle = Theme.of(context).textTheme.labelLarge;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
      child: Row(
        children: <Widget>[
          SizedBox(
            width: 32,
            child: Text('#', style: labelStyle),
          ),
          SizedBox(
            width: 120,
            child: Text('Reign', style: labelStyle),
          ),
          Expanded(
            child: Text("King's name", style: labelStyle),
          ),
        ],
      ),
    );
  }
}

class _KingListRow extends StatelessWidget {
  const _KingListRow({
    required this.index,
    required this.king,
    required this.guessed,
    required this.highlight,
  });

  final int index;
  final KingEntry king;
  final bool guessed;
  final bool highlight;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final TextStyle defaultStyle = theme.textTheme.bodyLarge!.copyWith(
      color: scheme.onSurfaceVariant,
    );

    final TextStyle guessedStyle = theme.textTheme.bodyLarge!.copyWith(
      fontWeight: FontWeight.w700,
      color: scheme.onSurface,
    );

    final String displayName = guessed ? king.name : '?????';

    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      curve: Curves.easeOut,
      color: highlight
          ? scheme.primary.withValues(alpha: 0.08)
          : Colors.transparent,
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: <Widget>[
          SizedBox(
            width: 32,
            child: Text(
              '${index + 1}',
              style: theme.textTheme.bodyMedium?.copyWith(
                color: scheme.onSurfaceVariant,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          SizedBox(
            width: 120,
            child: Text(
              king.reignYears,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: scheme.onSurfaceVariant,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          Expanded(
            child: Row(
              children: <Widget>[
                Text(
                  displayName,
                  style: guessed ? guessedStyle : defaultStyle,
                ),
                if (guessed) ...<Widget>[
                  const SizedBox(width: 6),
                  Icon(
                    Icons.check_circle_rounded,
                    size: 18,
                    color: scheme.primary,
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _KingsSummary extends StatelessWidget {
  const _KingsSummary({
    required this.state,
    required this.onPlayAgain,
    required this.onGoHome,
  });

  final KingsGameState state;
  final VoidCallback onPlayAgain;
  final VoidCallback onGoHome;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
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
                'All kings unlocked!',
                style: theme.textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.w700,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                'You typed all ${state.deck.length} monarchs correctly.',
                style: theme.textTheme.bodyLarge?.copyWith(
                  color: colorScheme.onSurfaceVariant,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  FestivalStatBadge(
                    label: 'Score',
                    value: '${state.score}',
                    icon: Icons.auto_awesome_rounded,
                  ),
                  const SizedBox(width: 16),
                  FestivalStatBadge(
                    label: 'Best streak',
                    value: '${state.bestStreak}',
                    icon: Icons.local_fire_department_rounded,
                  ),
                ],
              ),
              const SizedBox(height: 28),
              FilledButton(
                onPressed: onPlayAgain,
                style: FilledButton.styleFrom(
                  minimumSize: const Size.fromHeight(52),
                  textStyle: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
                ),
                child: const Text('Play again'),
              ),
              const SizedBox(height: 12),
              TextButton(
                onPressed: onGoHome,
                child: const Text('Back to home'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
