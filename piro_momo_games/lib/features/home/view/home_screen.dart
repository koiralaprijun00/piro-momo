import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../data/game_definition.dart';
import '../widgets/game_card.dart';
import '../widgets/piromomo_header.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  static const String routeName = 'home';

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Scaffold(
      backgroundColor: colorScheme.surface,
      body: SafeArea(
        bottom: false,
        child: LayoutBuilder(
          builder: (BuildContext context, BoxConstraints constraints) {
            final bool isWide = constraints.maxWidth >= 900;
            final EdgeInsets horizontalPadding = EdgeInsets.symmetric(
              horizontal: isWide ? 64 : 24,
            );

            return CustomScrollView(
              slivers: <Widget>[
                SliverToBoxAdapter(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: <Widget>[
                      const PiromomoHeader(),
                      const SizedBox(height: 24),
                      Padding(
                        padding: horizontalPadding,
                        child: _GameCardsGrid(
                          isWide: isWide,
                          availableWidth:
                              constraints.maxWidth -
                              horizontalPadding.horizontal,
                        ),
                      ),
                      const SizedBox(height: 32),
                    ],
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

class _GameCardsGrid extends StatelessWidget {
  const _GameCardsGrid({required this.isWide, required this.availableWidth});

  final bool isWide;
  final double availableWidth;

  @override
  Widget build(BuildContext context) {
    final List<GameDefinition> games = homeGames;

    if (isWide) {
      const double spacing = 24;
      final double cardWidth = (availableWidth - spacing) / 2;

      return Wrap(
        spacing: spacing,
        runSpacing: spacing,
        children: games
            .map(
              (GameDefinition game) => SizedBox(
                width: cardWidth,
                child: GameCard(
                  game: game,
                  onTap: () => context.push(game.routePath),
                ),
              ),
            )
            .toList(),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        for (int i = 0; i < games.length; i++) ...<Widget>[
          GameCard(
            game: games[i],
            onTap: () => context.push(games[i].routePath),
          ),
          if (i != games.length - 1) const SizedBox(height: 20),
        ],
      ],
    );
  }
}
