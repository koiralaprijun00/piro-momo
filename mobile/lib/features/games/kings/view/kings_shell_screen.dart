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
import '../../shared/widgets/glass_header.dart';
import '../../../shared/widgets/game_onboarding_shell.dart';

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
      return _KingsOnboarding(
        controller: controller,
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
                              title: 'Kings of Nepal',
                              subtitle: 'Unlocked ${state.guessedIds.length} of ${state.deck.length}',
                              onBack: () => context.pop(),
                              stats: [
                                HeaderStatChip(
                                  child: FestivalStatBadge(
                                    label: 'Found',
                                    value: '${state.guessedIds.length}/${state.deck.length}',
                                    icon: Icons.fact_check_rounded,
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
                    const SizedBox(height: 8),
                    // Give Up button
                    if (state.guessedIds.length < state.deck.length)
                        TextButton(
                          onPressed: () {
                            controller.giveUp();
                          },
                          style: TextButton.styleFrom(
                          foregroundColor: Colors.white.withValues(alpha: 0.7),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                          ),
                          child: const Text(
                            'Give Up',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                          ),
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
    return GameOnboardingShell(
      game: game,
      onPlay: controller.startGame,
      isLoading: isLoading,
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
                backgroundColor: colorScheme.surfaceContainerHighest.withValues(alpha: 0.4),
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
    // Filter to only show guessed kings
    final List<KingEntry> guessedKings = state.deck
        .where((king) => state.guessedIds.contains(king.id))
        .toList();

    if (guessedKings.isEmpty) {
      return _EmptyKingsState();
    }

    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      padding: const EdgeInsets.only(bottom: 16),
      itemCount: guessedKings.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (BuildContext context, int index) {
        final KingEntry king = guessedKings[index];
        final bool highlight = state.lastMatchedId == king.id;
        // Find the original index in the full deck for numbering
        final int originalIndex = state.deck.indexOf(king);
        return _KingCard(
          index: originalIndex,
          king: king,
          highlight: highlight,
        );
      },
    );
  }
}

class _EmptyKingsState extends StatelessWidget {
  const _EmptyKingsState();

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.search_rounded,
              size: 64,
              color: Colors.white.withValues(alpha: 0.3),
            ),
            const SizedBox(height: 16),
            Text(
              'Start guessing to reveal kings!',
              style: theme.textTheme.titleMedium?.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
              Text(
                'Type a king\'s name below',
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: Colors.white.withValues(alpha: 0.7),
                ),
                textAlign: TextAlign.center,
              ),
          ],
        ),
      ),
    );
  }
}

class _KingCard extends StatelessWidget {
  const _KingCard({
    required this.index,
    required this.king,
    required this.highlight,
  });

  final int index;
  final KingEntry king;
  final bool highlight;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);

    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeOut,
        decoration: BoxDecoration(
          color: highlight 
              ? Colors.white 
              : Colors.white.withValues(alpha: 0.95),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: highlight 
              ? const Color(0xFF6366F1)
              : Colors.white,
          width: highlight ? 2 : 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            // Number badge
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: const Color(0xFF6366F1).withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
              child: Center(
                child: Text(
                  '${index + 1}',
                  style: theme.textTheme.titleMedium?.copyWith(
                    color: const Color(0xFF6366F1),
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 16),
            // King info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    king.name,
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFF1F2937),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    king.reignYears,
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: const Color(0xFF6B7280),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
            // Check icon
            Icon(
              Icons.check_circle_rounded,
              color: const Color(0xFF10B981),
              size: 28,
            ),
          ],
        ),
      ),
    );
  }
}
