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
            final EdgeInsets horizontalPadding =
                EdgeInsets.symmetric(horizontal: isWide ? 64 : 24);

            return CustomScrollView(
              slivers: <Widget>[
                SliverToBoxAdapter(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: <Widget>[
                      const SizedBox(height: 24),
                      const PiromomoHeader(),
                      const SizedBox(height: 32),
                      Padding(
                        padding: horizontalPadding,
                        child: isWide
                            ? Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: <Widget>[
                                  Expanded(
                                    child: GameCard(
                                      game: homeGames.first,
                                      onTap: () => context
                                          .push(homeGames.first.routePath),
                                    ),
                                  ),
                                  const SizedBox(width: 24),
                                  Expanded(
                                    child: GameCard(
                                      game: homeGames.last,
                                      onTap: () => context
                                          .push(homeGames.last.routePath),
                                    ),
                                  ),
                                ],
                              )
                            : Column(
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
                      ),
                      const SizedBox(height: 48),
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
