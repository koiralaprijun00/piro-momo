import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../data/models/game_locale.dart';
import '../../../home/data/game_definition.dart';
import '../application/riddle_game_controller.dart';
import '../application/riddle_game_providers.dart';
import '../application/riddle_game_state.dart';
import '../widgets/riddle_answer_card.dart';
import '../widgets/riddle_summary_tiles.dart';

class GauKhaneKathaShellScreen extends ConsumerStatefulWidget {
  const GauKhaneKathaShellScreen({super.key});

  static const String routePath = '/games/gau-khane-katha';

  @override
  ConsumerState<GauKhaneKathaShellScreen> createState() =>
      _GauKhaneKathaShellScreenState();
}

class _GauKhaneKathaShellScreenState
    extends ConsumerState<GauKhaneKathaShellScreen> {
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
    final RiddleGameState state = ref.watch(riddleGameControllerProvider);
    final RiddleGameController controller = ref.read(
      riddleGameControllerProvider.notifier,
    );

    if (_answerController.text != state.userAnswer) {
      _answerController.value = TextEditingValue(
        text: state.userAnswer,
        selection: TextSelection.collapsed(offset: state.userAnswer.length),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Gau Khane Katha'),
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
              onSelectionChanged: (Set<GameLocale> value) {
                controller.changeLocale(value.first);
              },
            ),
          ),
        ],
      ),
      body: SafeArea(
        bottom: false,
        child: _RiddleGameBody(
          state: state,
          controller: controller,
          answerController: _answerController,
        ),
      ),
    );
  }
}

class _RiddleGameBody extends StatelessWidget {
  const _RiddleGameBody({
    required this.state,
    required this.controller,
    required this.answerController,
  });

  final RiddleGameState state;
  final RiddleGameController controller;
  final TextEditingController answerController;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (state.isLoading && state.deck.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }

    if (state.showOnboarding) {
      return _RiddleOnboarding(
        controller: controller,
        isLoading: state.isLoading,
      );
    }

    if (state.hasError) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            const Icon(Icons.error_outline, size: 42),
            const SizedBox(height: 12),
            Text(
              state.errorMessage ?? 'Unable to load riddles right now.',
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            FilledButton(
              onPressed: controller.loadDeck,
              child: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    final question = state.currentRiddle;
    if (question == null) {
      return const Center(child: Text('No riddles found.'));
    }

    final bool isWide = MediaQuery.of(context).size.width >= 980;
    final EdgeInsets padding = EdgeInsets.symmetric(
      horizontal: isWide ? 72 : 24,
      vertical: 28,
    );

    return SingleChildScrollView(
      padding:
          padding +
          EdgeInsets.only(bottom: MediaQuery.of(context).padding.bottom + 36),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          RiddleSummaryTiles(
            score: state.score,
            streak: state.streak,
            locale: state.locale,
            onRestart: controller.restart,
          ),
          const SizedBox(height: 28),
          RiddleAnswerCard(
            riddle: question,
            state: state,
            answerController: answerController,
            onAnswerChanged: controller.updateAnswer,
            onSubmitAnswer: controller.submitAnswer,
            onRevealAnswer: controller.revealAnswer,
            onNextRiddle: controller.nextRiddle,
          ),
          const SizedBox(height: 48),
        ],
      ),
    );
  }
}

class _RiddleOnboarding extends StatelessWidget {
  const _RiddleOnboarding({required this.controller, required this.isLoading});

  final RiddleGameController controller;
  final bool isLoading;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final game = homeGames.firstWhere(
      (GameDefinition game) => game.id == 'gau-khane-katha',
      orElse: () => homeGames.first,
    );

    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: theme.colorScheme.secondary.withOpacity(0.12),
                shape: BoxShape.circle,
              ),
              child: Icon(
                game.icon,
                size: 40,
                color: theme.colorScheme.secondary,
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
