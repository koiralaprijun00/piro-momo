import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../data/models/game_locale.dart';
import '../../../../data/models/king_entry.dart';
import '../../../home/data/game_definition.dart';
import '../../festival/widgets/festival_stat_badge.dart';
import '../../shared/widgets/game_locale_toggle.dart';
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

    if (state.showOnboarding) {
      return _KingsOnboarding(
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
              state.errorMessage ?? 'Unable to load Kings of Nepal data.',
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

    if (state.showSummary) {
      return _KingsSummary(
        state: state,
        onPlayAgain: controller.restart,
        onGoHome: () {
          controller.goHomeAndReset();
          context.go('/');
        },
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
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: <Color>[
                Color(0xFFF5F3FF),
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
                    _KingsStatsPanel(
                      state: state,
                      onBack: () => context.pop(),
                    ),
                    const SizedBox(height: 18),
                    _KingsInputPanel(
                      state: state,
                      controller: controller,
                      inputController: answerController,
                    ),
                    const SizedBox(height: 18),
                    Expanded(
                      child: _KingsListCard(state: state),
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
    required this.currentLocale,
    required this.onLocaleChange,
  });

  final KingsGameController controller;
  final bool isLoading;
  final GameLocale currentLocale;
  final ValueChanged<GameLocale> onLocaleChange;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final game = homeGames.firstWhere(
      (GameDefinition game) => game.id == KingsShellScreen.gameId,
      orElse: () => homeGames.first,
    );

    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final double playSectionHeight =
            72 + MediaQuery.of(context).padding.bottom + 16;
        final double contentHeight = (constraints.maxHeight - playSectionHeight)
            .clamp(360.0, constraints.maxHeight.toDouble());

        return Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 420),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                children: <Widget>[
                  SizedBox(
                    height: contentHeight,
                    child: Column(
                      children: <Widget>[
                        const SizedBox(height: 24),
                        Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: theme.colorScheme.primary.withValues(
                              alpha: 0.12,
                            ),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            game.icon,
                            size: 32,
                            color: theme.colorScheme.primary,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          game.title,
                          style: theme.textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.w700,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Type each Shah monarch\'s name to reveal the table. Keep your streak alive!',
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: theme.colorScheme.onBackground.withValues(
                              alpha: 0.75,
                            ),
                            height: 1.3,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 18),
                        GameLocaleToggle(
                          currentLocale: currentLocale,
                          onChanged: onLocaleChange,
                        ),
                        const SizedBox(height: 20),
                        Expanded(
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 18,
                              vertical: 14,
                            ),
                            decoration: BoxDecoration(
                              color: theme.colorScheme.surfaceVariant
                                  .withValues(alpha: 0.25),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: <Widget>[
                                Icon(Icons.table_rows_rounded,
                                    size: 36,
                                    color: theme.colorScheme.primary),
                                const SizedBox(height: 12),
                                Text(
                                  'All reign periods are lined up. Unlock each row by typing the matching king\'s name.',
                                  style: theme.textTheme.bodyMedium?.copyWith(
                                    color: theme.colorScheme.onSurface
                                        .withValues(alpha: 0.8),
                                    height: 1.4,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  FilledButton(
                    onPressed: isLoading ? null : controller.startGame,
                    style: FilledButton.styleFrom(
                      minimumSize: const Size.fromHeight(52),
                      textStyle: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w700,
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
                  const SizedBox(height: 16),
                ],
              ),
            ),
          ),
        );
      },
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
          Flexible(
            child: Wrap(
              alignment: WrapAlignment.end,
              crossAxisAlignment: WrapCrossAlignment.center,
              spacing: 8,
              runSpacing: 6,
              children: <Widget>[
                FestivalStatBadge(
                  label: 'Found',
                  value:
                      '${state.guessedIds.length}/${state.deck.length}',
                  icon: Icons.fact_check_rounded,
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
