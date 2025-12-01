import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';

import '../../../../data/models/district_entry.dart';
import '../../../home/data/game_definition.dart';
import '../../festival/widgets/festival_stat_badge.dart';
import '../../shared/widgets/header_stat_chip.dart';
import '../../shared/widgets/quiz_option_tile.dart';
import '../application/name_district_game_controller.dart';
import '../application/name_district_game_providers.dart';
import '../application/name_district_game_state.dart';

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
      return Container(
        color: const Color(0xFFF8F7F4),
        child: _NameDistrictOnboarding(
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
                            _NameDistrictHeader(
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
                    _PrimaryNextButton(
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
    final theme = Theme.of(context);

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            // Spacer to maintain heading position
            const SizedBox(height: 86),
            // Title
            Text(
              game.title,
              style: theme.textTheme.headlineLarge?.copyWith(
                fontWeight: FontWeight.w800,
                color: const Color(0xFF1A1A1A),
                letterSpacing: -0.5,
              ),
            ),
            const SizedBox(height: 12),
            // Description
            Text(
              game.description,
              maxLines: 3,
              style: theme.textTheme.bodyLarge?.copyWith(
                color: const Color(0xFF6B6B6B),
                height: 1.6,
                fontSize: 16,
              ),
            ),
            const Spacer(),
            // Buttons
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                TextButton(
                  onPressed: () => Navigator.of(context).pop(),
                  style: TextButton.styleFrom(
                    foregroundColor: const Color(0xFF6B6B6B),
                    padding: EdgeInsets.zero,
                    textStyle: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  child: const Text('Go Back'),
                ),
                const SizedBox(width: 16),
                FilledButton(
                  onPressed: isLoading ? null : controller.startGame,
                  style: FilledButton.styleFrom(
                    backgroundColor: const Color(0xFF2D2D2D),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 32,
                      vertical: 20,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    elevation: 0,
                    textStyle: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  child: isLoading
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2.5,
                            color: Colors.white,
                          ),
                        )
                      : const Text('Play'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _NameDistrictHeader extends StatelessWidget {
  const _NameDistrictHeader({required this.state, required this.onBack});

  final NameDistrictGameState state;
  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;

    return Container(
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
                  'Name the District',
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
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: colorScheme.outlineVariant.withValues(alpha: 0.25)),
        boxShadow: <BoxShadow>[
          BoxShadow(
            color: colorScheme.shadow.withValues(alpha: 0.08),
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
                color: colorScheme.surfaceVariant.withValues(alpha: 0.35),
                borderRadius: BorderRadius.circular(18),
              ),
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.all(10),
                  child: SvgPicture.asset(
                    district.assetPath,
                    colorFilter: ColorFilter.mode(
                      colorScheme.onSurface,
                      BlendMode.srcIn,
                    ),
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

class _PrimaryNextButton extends StatelessWidget {
  const _PrimaryNextButton({required this.isEnabled, required this.onPressed});

  final bool isEnabled;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;

    return SizedBox(
      height: 52,
      child: ElevatedButton.icon(
        onPressed: isEnabled ? onPressed : null,
        icon: const Icon(Icons.arrow_forward_rounded),
        label: const Text('Next'),
        style: ElevatedButton.styleFrom(
          elevation: isEnabled ? 3 : 0,
          backgroundColor: isEnabled
              ? colorScheme.primary
              : colorScheme.primary.withValues(alpha: 0.35),
          foregroundColor: isEnabled
              ? colorScheme.onPrimary
              : colorScheme.onPrimary.withValues(alpha: 0.8),
          textStyle: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.w700,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(28),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 26),
        ),
      ),
    );
  }
}
