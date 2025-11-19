import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';

import '../../../../data/models/district_entry.dart';
import '../../../../data/models/game_locale.dart';
import '../../../home/data/game_definition.dart';
import '../../festival/widgets/festival_stat_badge.dart';
import '../../shared/widgets/game_locale_toggle.dart';
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
        child: _NameDistrictContent(
          state: state,
          controller: controller,
        ),
      ),
    );
  }
}

class _NameDistrictContent extends StatelessWidget {
  const _NameDistrictContent({required this.state, required this.controller});

  final NameDistrictGameState state;
  final NameDistrictGameController controller;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;

    if (state.showOnboarding) {
      return _NameDistrictOnboarding(
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
              state.errorMessage ?? 'Unable to load districts.',
              style: theme.textTheme.titleMedium?.copyWith(
                color: colorScheme.error,
              ),
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

    final district = state.currentDistrict;
    if (district == null) {
      return const Center(child: Text('No districts available.'));
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
                Color(0xFFF6F3FF),
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
                            _DistrictQuestionCard(
                              state: state,
                              controller: controller,
                              district: district,
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
    required this.currentLocale,
    required this.onLocaleChange,
  });

  final NameDistrictGameController controller;
  final bool isLoading;
  final GameLocale currentLocale;
  final ValueChanged<GameLocale> onLocaleChange;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final game = homeGames.firstWhere(
      (GameDefinition game) => game.id == NameDistrictShellScreen.gameId,
      orElse: () => homeGames.first,
    );

    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: theme.colorScheme.primary.withOpacity(0.12),
                shape: BoxShape.circle,
              ),
              child: Icon(game.icon, size: 40, color: theme.colorScheme.primary),
            ),
            const SizedBox(height: 20),
            Text(
              game.title,
              style: theme.textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.w700,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              'Guess the district by its silhouette and stay sharp on Nepal\'s map.',
              textAlign: TextAlign.center,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
                height: 1.35,
              ),
            ),
            const SizedBox(height: 18),
            GameLocaleToggle(
              currentLocale: currentLocale,
              onChanged: onLocaleChange,
            ),
            const SizedBox(height: 24),
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
                const SizedBox(height: 2),
                Text(
                  'Identify Nepal\'s 77 districts by silhouette',
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
      padding: const EdgeInsets.fromLTRB(12, 12, 12, 10),
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
          const SizedBox(height: 12),
          AspectRatio(
            aspectRatio: 3 / 2,
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
              final String correctName =
                  district.localizedName(state.locale);
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
