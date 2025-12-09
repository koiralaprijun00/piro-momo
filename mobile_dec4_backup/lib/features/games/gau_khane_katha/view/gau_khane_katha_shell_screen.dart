import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../home/data/game_definition.dart';
import '../../festival/widgets/festival_stat_badge.dart';
import '../../shared/widgets/header_stat_chip.dart';
import '../application/riddle_game_controller.dart';
import '../application/riddle_game_providers.dart';
import '../application/riddle_game_state.dart';
import '../widgets/riddle_answer_card.dart';
import '../../shared/widgets/glass_header.dart';
import '../../../shared/widgets/game_onboarding_shell.dart';

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
      body: SafeArea(
        bottom: false,
        child: _RiddleGameBody(
          state: state,
          controller: controller,
          answerController: _answerController,
          onBack: () => context.pop(),
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
    required this.onBack,
  });

  final RiddleGameState state;
  final RiddleGameController controller;
  final TextEditingController answerController;
  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    final GameDefinition game = homeGames.firstWhere(
      (g) => g.id == 'gau-khane-katha',
    );

    if (state.isLoading && state.deck.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }

    if (state.showOnboarding) {
      return _RiddleOnboarding(
        controller: controller,
        isLoading: state.isLoading,
        game: game,
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

    final bool isWide = MediaQuery.of(context).size.width >= 960;
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
                          title: 'Gau Khane Katha',
                          onBack: onBack,
                          stats: [
                            HeaderStatChip(
                              child: FestivalStatBadge(
                                label: 'Score',
                                value: '${state.score}',
                                icon: Icons.auto_awesome_rounded,
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
                        const SizedBox(height: 24),
                        RiddleAnswerCard(
                          riddle: question,
                          state: state,
                          answerController: answerController,
                          onAnswerChanged: controller.updateAnswer,
                          onSubmitAnswer: controller.submitAnswer,
                          onRevealAnswer: controller.revealAnswer,
                          onNextRiddle: controller.nextRiddle,
                        ),
                        const SizedBox(height: 32),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _RiddleOnboarding extends StatelessWidget {
  const _RiddleOnboarding({
    required this.controller,
    required this.isLoading,
    required this.game,
  });

  final RiddleGameController controller;
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
