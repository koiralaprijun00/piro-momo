import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/app_palette.dart';
import '../../../core/theme/app_theme.dart';
import '../data/game_definition.dart';
import '../widgets/game_card.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  static const String routeName = 'home';

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Scaffold(
      backgroundColor: colorScheme.background,
      body: SafeArea(
        bottom: false,
        child: LayoutBuilder(
          builder: (BuildContext context, BoxConstraints constraints) {
            final bool isWide = constraints.maxWidth >= 900;
            final EdgeInsets padding = EdgeInsets.symmetric(
              horizontal: isWide ? 64 : 24,
              vertical: 24,
            );

            return CustomScrollView(
              slivers: <Widget>[
                SliverToBoxAdapter(
                  child: Padding(
                    padding: padding,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        _HeroBanner(isWide: isWide),
                        const SizedBox(height: 32),
                        Text(
                          'Featured Games',
                          style: Theme.of(context).textTheme.headlineSmall
                              ?.copyWith(
                                fontWeight: FontWeight.w700,
                                color: colorScheme.onBackground,
                              ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          'Take a quick break, learn something new, and keep your streaks alive.',
                          style: Theme.of(context).textTheme.bodyLarge
                              ?.copyWith(
                                color: colorScheme.onBackground.withOpacity(
                                  0.7,
                                ),
                              ),
                        ),
                        const SizedBox(height: 28),
                        if (isWide)
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: <Widget>[
                              Expanded(
                                child: GameCard(
                                  game: homeGames.first,
                                  onTap: () =>
                                      context.push(homeGames.first.routePath),
                                ),
                              ),
                              const SizedBox(width: 24),
                              Expanded(
                                child: GameCard(
                                  game: homeGames.last,
                                  onTap: () =>
                                      context.push(homeGames.last.routePath),
                                ),
                              ),
                            ],
                          )
                        else
                          Column(
                            children: <Widget>[
                              GameCard(
                                game: homeGames.first,
                                onTap: () =>
                                    context.push(homeGames.first.routePath),
                              ),
                              const SizedBox(height: 20),
                              GameCard(
                                game: homeGames.last,
                                onTap: () =>
                                    context.push(homeGames.last.routePath),
                              ),
                            ],
                          ),
                        const SizedBox(height: 48),
                      ],
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}

class _HeroBanner extends StatelessWidget {
  const _HeroBanner({required this.isWide});

  final bool isWide;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final GradientTheme? gradientTheme = theme.extension<GradientTheme>();
    final TextTheme textTheme = theme.textTheme;
    final ColorScheme colorScheme = theme.colorScheme;

    return Container(
      decoration: BoxDecoration(
        gradient: gradientTheme?.hero ?? AppPalette.heroGradient,
        borderRadius: BorderRadius.circular(32),
        boxShadow: <BoxShadow>[
          BoxShadow(
            color: AppPalette.primaryBlue.withOpacity(0.25),
            blurRadius: 36,
            offset: const Offset(0, 24),
          ),
        ],
      ),
      padding: EdgeInsets.symmetric(
        horizontal: isWide ? 40 : 28,
        vertical: isWide ? 40 : 32,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            'Piro Momo Games',
            style: textTheme.displaySmall?.copyWith(
              color: Colors.white,
              fontWeight: FontWeight.w700,
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Daily brain food steeped in Nepali culture. Play a quick round, learn a story, keep your streak.',
            style: textTheme.bodyLarge?.copyWith(
              color: Colors.white.withOpacity(0.92),
              height: 1.5,
            ),
          ),
          const SizedBox(height: 20),
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: <Widget>[
              _HeroBadge(
                icon: Icons.calendar_month_rounded,
                label: 'Fresh content daily',
              ),
              _HeroBadge(
                icon: Icons.language_rounded,
                label: 'Nepali & English modes',
              ),
              _HeroBadge(
                icon: Icons.star_rounded,
                label: 'Track streaks & share wins',
              ),
            ],
          ),
          const SizedBox(height: 28),
          FilledButton.icon(
            style: FilledButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: AppPalette.nepalBlue,
              padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 14),
              textStyle: textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w700,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(18),
              ),
            ),
            onPressed: () => context.push(homeGames.first.routePath),
            icon: const Icon(Icons.play_arrow_rounded),
            label: const Text('Jump into a game'),
          ),
          const SizedBox(height: 12),
          TextButton.icon(
            style: TextButton.styleFrom(
              foregroundColor: Colors.white.withOpacity(0.9),
              padding: const EdgeInsets.symmetric(horizontal: 0),
            ),
            onPressed: () => context.push(homeGames.last.routePath),
            icon: const Icon(Icons.explore_rounded),
            label: const Text('Explore Gau Khane Katha'),
          ),
          const SizedBox(height: 4),
          Divider(height: 32, color: Colors.white.withOpacity(0.25)),
          Row(
            children: <Widget>[
              CircleAvatar(
                radius: 22,
                backgroundColor: Colors.white.withOpacity(0.2),
                child: const Icon(Icons.lightbulb_rounded, color: Colors.white),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Text(
                  'Built for curious minds across the diaspora — stay connected to Nepali culture wherever you are.',
                  style: textTheme.bodyMedium?.copyWith(
                    color: Colors.white.withOpacity(0.9),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _HeroBadge extends StatelessWidget {
  const _HeroBadge({required this.icon, required this.label});

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.18),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.25), width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Icon(icon, size: 18, color: Colors.white),
          const SizedBox(width: 8),
          Text(
            label,
            style: textTheme.labelMedium?.copyWith(
              color: Colors.white,
              letterSpacing: 0.2,
            ),
          ),
        ],
      ),
    );
  }
}
