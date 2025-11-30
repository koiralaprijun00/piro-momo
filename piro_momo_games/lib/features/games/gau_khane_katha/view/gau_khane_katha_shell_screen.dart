import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../data/models/game_locale.dart';
import '../../../home/data/game_definition.dart';
import '../../festival/widgets/festival_stat_badge.dart';
import '../../shared/widgets/game_locale_toggle.dart';
import '../../shared/widgets/header_stat_chip.dart';
import '../application/riddle_game_controller.dart';
import '../application/riddle_game_providers.dart';
import '../application/riddle_game_state.dart';
import '../widgets/riddle_answer_card.dart';

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
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;
    final GameDefinition game = homeGames.firstWhere(
      (g) => g.id == 'gau-khane-katha',
    );

    if (state.isLoading && state.deck.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }

    if (state.showOnboarding) {
      return Container(
        color: const Color(0xFFF8F7F4),
        child: _RiddleOnboarding(
          controller: controller,
          isLoading: state.isLoading,
          currentLocale: state.locale,
          onLocaleChange: controller.changeLocale,
          game: game,
        ),
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
                        _RiddleHeader(state: state, onBack: onBack),
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

class _RiddleHeader extends StatelessWidget {
  const _RiddleHeader({required this.state, required this.onBack});

  final RiddleGameState state;
  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;

    return Container(
      margin: const EdgeInsets.only(top: 4),
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
      decoration: BoxDecoration(
        color: scheme.surface.withValues(alpha: 0.8),
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
                  'Gau Khane Katha',
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

class _RiddleOnboarding extends StatelessWidget {
  const _RiddleOnboarding({
    required this.controller,
    required this.isLoading,
    required this.currentLocale,
    required this.onLocaleChange,
    required this.game,
  });

  final RiddleGameController controller;
  final bool isLoading;
  final GameLocale currentLocale;
  final ValueChanged<GameLocale> onLocaleChange;
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
            GameLocaleToggle(
              currentLocale: currentLocale,
              onChanged: onLocaleChange,
            ),
            const SizedBox(height: 40),
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
