import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../home/data/game_definition.dart';
import '../../festival/widgets/festival_stat_badge.dart';
import '../../shared/widgets/glass_header.dart';
import '../../shared/widgets/header_stat_chip.dart';
import '../../../shared/widgets/game_onboarding_shell.dart';
import '../application/temple_game_controller.dart';
import '../application/temple_game_providers.dart';
import '../application/temple_game_state.dart';
import '../../../../data/models/temple_entry.dart';

class TempleShellScreen extends ConsumerStatefulWidget {
  const TempleShellScreen({super.key});

  static const String routePath = '/games/guess-temple';
  static const String gameId = 'guess-temple';

  @override
  ConsumerState<TempleShellScreen> createState() => _TempleShellScreenState();
}

class _TempleShellScreenState extends ConsumerState<TempleShellScreen> {
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
    final TempleGameState state = ref.watch(templeGameControllerProvider);
    final TempleGameController controller = ref.read(
      templeGameControllerProvider.notifier,
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
        child: _TempleGameContent(
          state: state,
          controller: controller,
          answerController: _answerController,
        ),
      ),
    );
  }
}

class _TempleGameContent extends StatelessWidget {
  const _TempleGameContent({
    required this.state,
    required this.controller,
    required this.answerController,
  });

  final TempleGameState state;
  final TempleGameController controller;
  final TextEditingController answerController;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;
    final GameDefinition game = homeGames.firstWhere(
      (g) => g.id == TempleShellScreen.gameId,
    );
    final TempleEntry? temple = state.currentTemple;

    if (state.showOnboarding) {
      return _TempleOnboarding(
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
            const SizedBox(height: 12),
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

    if (temple == null) {
      return const Center(child: Text('No temples available right now.'));
    }

    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final bool isWide = constraints.maxWidth >= 960;
        final EdgeInsets contentPadding = EdgeInsets.symmetric(
          horizontal: isWide ? 120 : 20,
          vertical: isWide ? 32 : 16,
        );

        return Container(
          width: double.infinity,
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Color(0xFF2563EB), // Blue
                Color(0xFF7C3AED), // Purple
                Color(0xFFEC4899), // Pink
              ],
            ),
          ),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 920),
              child: Padding(
                padding: EdgeInsets.only(
                  left: contentPadding.left,
                  right: contentPadding.right,
                  top: contentPadding.top,
                  bottom: 12,
                ),
                child: Column(
                  children: <Widget>[
                    Expanded(
                      child: SingleChildScrollView(
                        padding: EdgeInsets.only(
                          bottom: 24 + MediaQuery.of(context).viewInsets.bottom,
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: <Widget>[
                            GlassHeader(
                              title: 'Guess the Temple',
                              subtitle:
                                  'Temple ${state.currentIndex + 1} of ${state.deck.length}',
                              onBack: () => context.pop(),
                              stats: [
                                HeaderStatChip(
                                  child: FestivalStatBadge(
                                    label: 'Score',
                                    value: '${state.score}',
                                    icon: Icons.auto_awesome_rounded,
                                    compact: true,
                                    color: Colors.white,
                                    backgroundColor:
                                        Colors.white.withValues(alpha: 0.15),
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
                                    backgroundColor:
                                        Colors.white.withValues(alpha: 0.15),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 16),
                            _TempleCard(
                              temple: temple,
                              state: state,
                            ),
                            if (state.isAnswered) ...[
                              const SizedBox(height: 16),
                              _ResultCard(
                                temple: temple,
                                isCorrect: state.isCorrect ?? false,
                              ),
                            ],
                          ],
                        ),
                      ),
                    ),
                    SafeArea(
                      top: false,
                      child: Padding(
                        padding: const EdgeInsets.only(top: 8.0),
                        child: _BottomInputCard(
                          state: state,
                          controller: controller,
                          answerController: answerController,
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

class _TempleCard extends StatelessWidget {
  const _TempleCard({
    required this.temple,
    required this.state,
  });

  final TempleEntry temple;
  final TempleGameState state;

  @override
  Widget build(BuildContext context) {
    final bool isAnswered = state.isAnswered;
    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 300),
      switchInCurve: Curves.easeInOut,
      switchOutCurve: Curves.easeInOut,
      layoutBuilder: (Widget? currentChild, List<Widget> previousChildren) {
        return Stack(
          alignment: Alignment.topCenter,
          children: <Widget>[
            ...previousChildren,
            if (currentChild != null) currentChild,
          ],
        );
      },
      child: Card(
        key: ValueKey<String>('temple-${temple.id}-$isAnswered'),
        clipBehavior: Clip.antiAlias,
        elevation: 10,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            AspectRatio(
              aspectRatio: 16 / 9,
              child: Stack(
                fit: StackFit.expand,
                children: <Widget>[
                  Image.asset(
                    temple.imagePath,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) {
                      return Container(
                        color: Colors.grey.shade200,
                        alignment: Alignment.center,
                        child: const Icon(Icons.broken_image_outlined, size: 48),
                      );
                    },
                  ),
                  if (state.hasWon)
                    Container(
                      color: Colors.black.withValues(alpha: 0.45),
                      alignment: Alignment.center,
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: const <Widget>[
                          Icon(Icons.emoji_events_rounded,
                              color: Colors.amber, size: 48),
                          SizedBox(height: 8),
                          Text(
                            'You mastered the temples!',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w700,
                              fontSize: 18,
                            ),
                          ),
                        ],
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ResultCard extends StatelessWidget {
  const _ResultCard({
    required this.temple,
    required this.isCorrect,
  });

  final TempleEntry temple;
  final bool isCorrect;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    return Container(
      decoration: BoxDecoration(
        color: isCorrect ? Colors.green.shade50 : Colors.red.shade50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isCorrect ? Colors.green.shade200 : Colors.red.shade200,
        ),
      ),
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Row(
            children: <Widget>[
              Icon(
                isCorrect ? Icons.check_circle : Icons.cancel,
                color: isCorrect ? Colors.green.shade600 : Colors.red.shade600,
              ),
              const SizedBox(width: 8),
              Text(
                isCorrect ? 'Correct!' : 'Incorrect',
                style: theme.textTheme.titleMedium?.copyWith(
                  color:
                      isCorrect ? Colors.green.shade800 : Colors.red.shade800,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            temple.name,
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            '${temple.district} • ${temple.type}',
            style: theme.textTheme.bodySmall?.copyWith(
              color: Colors.grey.shade700,
            ),
          ),
          if (temple.built != null) ...[
            const SizedBox(height: 4),
            Text(
              'Built: ${temple.built}',
              style: theme.textTheme.bodySmall?.copyWith(
                color: Colors.grey.shade700,
              ),
            ),
          ],
          if (temple.deity != null) ...[
            const SizedBox(height: 4),
            Text(
              'Primary Deity: ${temple.deity}',
              style: theme.textTheme.bodySmall?.copyWith(
                color: Colors.grey.shade700,
              ),
            ),
          ],
          if (temple.description != null) ...[
            const SizedBox(height: 8),
            Text(
              temple.description!,
              style: theme.textTheme.bodyMedium,
            ),
          ],
        ],
      ),
    );
  }
}

class _BottomInputCard extends StatelessWidget {
  const _BottomInputCard({
    required this.state,
    required this.controller,
    required this.answerController,
  });

  final TempleGameState state;
  final TempleGameController controller;
  final TextEditingController answerController;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final bool canSubmit =
        !state.isAnswered && state.userAnswer.trim().isNotEmpty;

    return Material(
      elevation: 12,
      borderRadius: BorderRadius.circular(20),
      color: Colors.white,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            Text(
              'Type the temple name to guess',
              style: theme.textTheme.titleMedium
                  ?.copyWith(fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: answerController,
              onChanged: controller.updateAnswer,
              onSubmitted: controller.submitGuess,
              enabled: !state.isAnswered,
              decoration: InputDecoration(
                hintText: 'Enter temple name...',
                filled: true,
                fillColor: Colors.grey.shade100,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: BorderSide.none,
                ),
                suffixIcon: IconButton(
                  icon: Icon(
                    state.isAnswered
                        ? Icons.check_circle_outline_rounded
                        : Icons.send_rounded,
                  ),
                  onPressed: canSubmit
                      ? () => controller.submitGuess(
                            answerController.text,
                          )
                      : null,
                ),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Tip: Common spelling variations are accepted.',
              style: theme.textTheme.bodySmall
                  ?.copyWith(color: Colors.grey.shade600),
            ),
            const SizedBox(height: 12),
            Row(
              children: <Widget>[
                Expanded(
                  child: FilledButton(
                    onPressed:
                        state.isAnswered ? controller.nextTemple : null,
                    style: FilledButton.styleFrom(
                      backgroundColor: Colors.indigo.shade600,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                    child: const Text('Next Temple'),
                  ),
                ),
                const SizedBox(width: 12),
                IconButton.filledTonal(
                  onPressed: controller.shuffleTemples,
                  icon: const Icon(Icons.shuffle_rounded),
                  tooltip: 'Shuffle temple',
                ),
                const SizedBox(width: 8),
                IconButton.outlined(
                  onPressed: controller.restart,
                  icon: const Icon(Icons.restart_alt_rounded),
                  tooltip: 'Restart',
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _TempleOnboarding extends StatelessWidget {
  const _TempleOnboarding({
    required this.controller,
    required this.isLoading,
    required this.game,
  });

  final TempleGameController controller;
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
