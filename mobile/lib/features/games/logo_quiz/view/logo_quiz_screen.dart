import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../home/data/game_definition.dart';
import '../../../shared/widgets/game_onboarding_shell.dart';
import '../../festival/widgets/festival_stat_badge.dart';
import '../../shared/widgets/glass_header.dart';
import '../../shared/widgets/header_stat_chip.dart';
import '../application/logo_quiz_providers.dart';
import '../application/logo_quiz_controller.dart';
import '../application/logo_quiz_state.dart';
import '../domain/logo_model.dart';

class LogoQuizScreen extends ConsumerStatefulWidget {
  static const String routePath = '/logo-quiz';
  static const String gameId = 'logo-quiz';

  const LogoQuizScreen({super.key});

  @override
  ConsumerState<LogoQuizScreen> createState() => _LogoQuizScreenState();
}

class _LogoQuizScreenState extends ConsumerState<LogoQuizScreen> {
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
    final LogoQuizState state = ref.watch(logoQuizControllerProvider);
    final LogoQuizController controller =
        ref.read(logoQuizControllerProvider.notifier);

    // Sync text controller with state
    final String currentAnswer = state.currentAnswer;
    if (_answerController.text != currentAnswer) {
      _answerController.value = TextEditingValue(
        text: currentAnswer,
        selection: TextSelection.collapsed(offset: currentAnswer.length),
      );
    }

    return Scaffold(
      body: SafeArea(
        bottom: false,
        child: _LogoQuizContent(
          state: state,
          controller: controller,
          answerController: _answerController,
        ),
      ),
    );
  }
}

class _LogoQuizContent extends StatelessWidget {
  const _LogoQuizContent({
    required this.state,
    required this.controller,
    required this.answerController,
  });

  final LogoQuizState state;
  final LogoQuizController controller;
  final TextEditingController answerController;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;
    final GameDefinition game = homeGames.firstWhere(
      (g) => g.id == LogoQuizScreen.gameId,
    );

    if (state.showOnboarding) {
      return _LogoQuizOnboarding(
        controller: controller,
        isLoading: state.isLoading,
        game: game,
      );
    }

    if (state.isLoading && state.logos.isEmpty) {
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
            FilledButton.icon(
              onPressed: state.isLoading ? null : controller.resetGame,
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

    if (state.showSummary) {
      return _LogoQuizSummary(
        state: state,
        onPlayAgain: controller.resetGame,
        onBack: () => context.pop(),
      );
    }

    final logo = state.currentLogo;
    if (logo == null) {
      return const Center(child: Text('No logos available right now.'));
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
                Color(0xFFDC2626), // Red (Nepal theme)
                Color(0xFFF472B6), // Pink
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
                          bottom:
                              24 + MediaQuery.of(context).viewInsets.bottom,
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: <Widget>[
                            GlassHeader(
                              title: 'Logo Quiz',
                              subtitle:
                                  'Logo ${state.currentIndex + 1} of ${state.logos.length}',
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
                                const SizedBox(width: 8),
                                HeaderStatChip(
                                  child: FestivalStatBadge(
                                    label: state.isTimerActive ? 'Time' : 'Paused',
                                    value: _formatTime(state.timeLeft),
                                    icon: state.isTimerActive
                                        ? Icons.timer_rounded
                                        : Icons.pause_circle_filled_rounded,
                                    compact: true,
                                    color: Colors.white,
                                    backgroundColor:
                                        Colors.white.withValues(alpha: 0.15),
                                  ),
                                ),

                              ],
                            ),
                            const SizedBox(height: 16),
                            _LogoCard(
                              logo: logo,
                              state: state,
                              blurAmount: controller.blurFor(logo.id),
                            ),
                            if (state.correctAnswers[logo.id] == true) ...[
                              const SizedBox(height: 16),
                              _ResultCard(
                                logo: logo,
                                isCorrect: true,
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

  String _formatTime(int totalSeconds) {
    final int minutes = totalSeconds ~/ 60;
    final int seconds = totalSeconds % 60;
    return '$minutes:${seconds.toString().padLeft(2, '0')}';
  }
}

class _LogoCard extends StatelessWidget {
  const _LogoCard({
    required this.logo,
    required this.state,
    required this.blurAmount,
  });

  final Logo logo;
  final LogoQuizState state;
  final double blurAmount;

  @override
  Widget build(BuildContext context) {
    final bool isCorrect = state.correctAnswers[logo.id] == true;
    final int attempts = state.attempts[logo.id] ?? 0;

    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 300),
      switchInCurve: Curves.easeInOut,
      switchOutCurve: Curves.easeInOut,
      child: Card(
        key: ValueKey<String>('logo-${logo.id}-$isCorrect-$attempts'),
        clipBehavior: Clip.antiAlias,
        elevation: 10,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            AspectRatio(
              aspectRatio: 1, // Square for logos
              child: Stack(
                fit: StackFit.expand,
                children: <Widget>[
                  ImageFiltered(
                    imageFilter: ImageFilter.blur(
                      sigmaX: blurAmount,
                      sigmaY: blurAmount,
                    ),
                    child: Image.asset(
                      logo.imagePath,
                      fit: BoxFit.contain,
                      errorBuilder: (_, __, ___) {
                        return Container(
                          color: Colors.grey.shade200,
                          alignment: Alignment.center,
                          child: const Icon(
                              Icons.broken_image_outlined, size: 48),
                        );
                      },
                    ),
                  ),
                  if (isCorrect)
                    Container(
                      color: Colors.green.withValues(alpha: 0.3),
                      alignment: Alignment.center,
                      child: const Icon(
                        Icons.check_circle_rounded,
                        color: Colors.white,
                        size: 64,
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
    required this.logo,
    required this.isCorrect,
  });

  final Logo logo;
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
            logo.name,
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Category: ${logo.category} • Difficulty: ${logo.difficulty}',
            style: theme.textTheme.bodySmall?.copyWith(
              color: Colors.grey.shade700,
            ),
          ),
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

  final LogoQuizState state;
  final LogoQuizController controller;
  final TextEditingController answerController;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final logo = state.currentLogo;
    final bool isAnswered = logo != null && state.correctAnswers[logo.id] == true;
    final bool canSubmit = !isAnswered && answerController.text.trim().isNotEmpty;
    final String? feedback =
        logo == null ? null : state.feedback[logo.id];

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
              'Type the brand name',
              style: theme.textTheme.titleMedium
                  ?.copyWith(fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: answerController,
              onChanged: controller.updateAnswer,
              onSubmitted: controller.checkAnswer,
              enabled: !isAnswered && !state.isGameOver,
              decoration: InputDecoration(
                hintText: 'Enter logo name...',
                filled: true,
                fillColor: Colors.grey.shade100,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: BorderSide.none,
                ),
                suffixIcon: IconButton(
                  icon: Icon(
                    isAnswered
                        ? Icons.check_circle_outline_rounded
                        : Icons.send_rounded,
                  ),
                  onPressed: canSubmit
                      ? () => controller.checkAnswer(answerController.text)
                      : null,
                ),
              ),
            ),
            if (feedback != null && feedback.isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(
                feedback,
                style: theme.textTheme.bodySmall?.copyWith(
                  color: state.correctAnswers[logo?.id ?? ''] == true
                      ? Colors.green.shade700
                      : Colors.red.shade700,
                ),
              ),
            ],
            const SizedBox(height: 8),
            Text(
              '💡 Tip: Wrong guesses reveal the logo! Blur decreases with each attempt.',
              style: theme.textTheme.bodySmall
                  ?.copyWith(color: Colors.grey.shade600),
            ),
            const SizedBox(height: 12),
            Row(
              children: <Widget>[
                IconButton.filled(
                  onPressed: controller.toggleTimer,
                  icon: Icon(
                    state.isTimerActive
                        ? Icons.pause_rounded
                        : Icons.play_arrow_rounded,
                  ),
                  tooltip: state.isTimerActive ? 'Pause timer' : 'Resume timer',
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: FilledButton(
                    onPressed: isAnswered ? controller.nextLogo : null,
                    style: FilledButton.styleFrom(
                      backgroundColor: Colors.indigo.shade600,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                    child: const Text('Next Logo'),
                  ),
                ),
                const SizedBox(width: 12),
                IconButton.filledTonal(
                  onPressed: state.currentIndex > 0 ? controller.prevLogo : null,
                  icon: const Icon(Icons.arrow_back_rounded),
                  tooltip: 'Previous logo',
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _LogoQuizSummary extends StatelessWidget {
  const _LogoQuizSummary({
    required this.state,
    required this.onPlayAgain,
    required this.onBack,
  });

  final LogoQuizState state;
  final VoidCallback onPlayAgain;
  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final int total = state.logos.length;
    final int correct = state.correctAnswers.length;
    final int timeUsed = 300 - state.timeLeft;

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 620),
              child: Card(
                elevation: 8,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      Text(
                        'Logo Quiz Results',
                        style: theme.textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'You identified $correct of $total logos',
                        style: theme.textTheme.bodyLarge,
                      ),
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: <Widget>[
                          _SummaryChip(
                            icon: Icons.score_rounded,
                            label: 'Score',
                            value: '${state.score}',
                          ),
                          const SizedBox(width: 12),
                          _SummaryChip(
                            icon: Icons.timer_rounded,
                            label: 'Time',
                            value:
                                '${timeUsed ~/ 60}:${(timeUsed % 60).toString().padLeft(2, '0')}',
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: <Widget>[
                          OutlinedButton.icon(
                            onPressed: onBack,
                            icon: const Icon(Icons.home_rounded),
                            label: const Text('Home'),
                          ),
                          const SizedBox(width: 12),
                          FilledButton.icon(
                            onPressed: onPlayAgain,
                            icon: const Icon(Icons.refresh_rounded),
                            label: const Text('Play again'),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _SummaryChip extends StatelessWidget {
  const _SummaryChip({
    required this.icon,
    required this.label,
    required this.value,
  });

  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    return Chip(
      avatar: Icon(icon, size: 18),
      label: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            label,
            style: theme.textTheme.labelSmall,
          ),
          Text(
            value,
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
      padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 10),
    );
  }
}

class _LogoQuizOnboarding extends StatelessWidget {
  const _LogoQuizOnboarding({
    required this.controller,
    required this.isLoading,
    required this.game,
  });

  final LogoQuizController controller;
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
