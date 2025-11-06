import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

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
    final TextTheme textTheme = theme.textTheme;

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Icon(
          homeGames.first.icon,
          size: isWide ? 32 : 28,
          color: theme.colorScheme.onBackground,
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(
                'Piro Momo Games',
                style: textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.w700,
                  letterSpacing: -0.4,
                  color: theme.colorScheme.onBackground,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Built for curious minds across the diaspora\nStay connected to Nepali culture wherever you are.',
                style: textTheme.bodyLarge?.copyWith(
                  color: theme.colorScheme.onBackground.withOpacity(0.72),
                  height: 1.45,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
