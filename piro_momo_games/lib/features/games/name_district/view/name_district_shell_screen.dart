import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';

import '../../../../data/models/district_entry.dart';
import '../../../home/data/game_definition.dart';
import '../../festival/widgets/festival_stat_badge.dart';
import '../../shared/widgets/header_stat_chip.dart';
import '../../shared/widgets/quiz_option_tile.dart';
import '../../shared/widgets/glass_header.dart';
import '../../shared/widgets/glass_primary_button.dart';
import '../application/name_district_game_controller.dart';
import '../application/name_district_game_providers.dart';
import '../application/name_district_game_state.dart';
import '../../../shared/widgets/game_onboarding_shell.dart';

class NameDistrictShellScreen extends ConsumerWidget {
  const NameDistrictShellScreen({super.key});

  static const String routePath = '/games/name-district';
  static const String gameId = 'name-district';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final NameDistrictGameState state = ref.watch(
      nameDistrictGameControllerProvider,
    );
    final NameDistrictGameController controller = ref.read(
      nameDistrictGameControllerProvider.notifier,
    );

    return Scaffold(
      body: SafeArea(
        bottom: false,
        child: _NameDistrictGameContent(
          state: state,
          controller: controller,
        ),
      ),
    );
  }
}

class _NameDistrictGameContent extends StatelessWidget {
  const _NameDistrictGameContent({required this.state, required this.controller});

  final NameDistrictGameState state;
  final NameDistrictGameController controller;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;
    final GameDefinition game = homeGames.firstWhere(
      (g) => g.id == 'name-district',
    );

    if (state.showOnboarding) {
      return _NameDistrictOnboarding(
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
            FilledButton(
              onPressed: controller.loadDeck,
              child: const Text('Try again'),
            ),
          ],
        ),
      );
    }

    final district = state.currentDistrict;
    if (district == null) {
      return const Center(child: Text('No questions available.'));
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
                              title: 'Name the District',
                              onBack: () => context.pop(),
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
                              child: _DistrictQuestionCard(
                                state: state,
                                district: district,
                                controller: controller,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    GlassPrimaryButton(
                      isEnabled: state.isAnswered,
                      onPressed:
                          state.isAnswered ? controller.nextDistrict : null,
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

class _NameDistrictOnboarding extends StatelessWidget {
  const _NameDistrictOnboarding({
    required this.controller,
    required this.isLoading,
    required this.game,
  });

  final NameDistrictGameController controller;
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

class _DistrictQuestionCard extends StatelessWidget {
  const _DistrictQuestionCard({
    required this.state,
    required this.controller,
    required this.district,
  });

  final NameDistrictGameState state;
  final NameDistrictGameController controller;
  final DistrictEntry district;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;
    return Container(
      padding: const EdgeInsets.fromLTRB(12, 12, 12, 8),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.9),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: Colors.white),
        boxShadow: <BoxShadow>[
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 40,
            offset: const Offset(0, 24),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          Text(
            'District ${state.currentIndex + 1} / ${state.deck.length}',
            style: theme.textTheme.labelLarge?.copyWith(
              color: colorScheme.primary,
              letterSpacing: 0.8,
            ),
          ),
          const SizedBox(height: 8),
          AspectRatio(
            aspectRatio: 2 / 1,
            child: DecoratedBox(
              decoration: BoxDecoration(
                color: colorScheme.surfaceContainerHighest.withValues(alpha: 0.35),
                borderRadius: BorderRadius.circular(18),
              ),
              child: Padding(
                padding: const EdgeInsets.all(8),
                child: SvgPicture.asset(
                  district.assetPath,
                  fit: BoxFit.contain,
                  width: double.infinity,
                  height: double.infinity,
                  colorFilter: ColorFilter.mode(
                    colorScheme.onSurface,
                    BlendMode.srcIn,
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Choose from options:',
            style: theme.textTheme.labelMedium?.copyWith(
              color: colorScheme.onSurfaceVariant,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 8),
          Column(
            children: state.currentOptions.asMap().entries.map((entry) {
              final int index = entry.key;
              final String option = entry.value;
              final String correctName = district.englishName;
              final bool showCorrect =
                  state.isAnswered && option == correctName;
              final bool showIncorrect = state.isAnswered &&
                  state.selectedOption == option &&
                  !showCorrect;
              return Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: QuizOptionTile(
                  leadingLabel: '${String.fromCharCode(65 + index)}.',
                  label: option,
                  isSelected: !state.isAnswered &&
                      state.selectedOption == option,
                  isDisabled: state.isAnswered,
                  showCorrectState: showCorrect,
                  showIncorrectState: showIncorrect,
                  onPressed: () => controller.submitGuess(option),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 8),
        ],
      ),
    );
  }
}
