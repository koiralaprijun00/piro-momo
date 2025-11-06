import 'package:flutter/material.dart';

import '../data/game_definition.dart';

class GameCard extends StatelessWidget {
  const GameCard({super.key, required this.game, this.onTap});

  final GameDefinition game;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final textTheme = theme.textTheme;

    final Gradient gradient = LinearGradient(
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
      colors: game.accentColors,
    );

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(28),
      child: Container(
        decoration: BoxDecoration(
          gradient: gradient,
          borderRadius: BorderRadius.circular(28),
          boxShadow: <BoxShadow>[
            BoxShadow(
              color: game.accentColors.first.withOpacity(0.25),
              blurRadius: 24,
              offset: const Offset(0, 18),
            ),
          ],
        ),
        padding: const EdgeInsets.fromLTRB(24, 24, 24, 28),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Align(
              alignment: Alignment.topRight,
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.22),
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Icon(game.icon, size: 24, color: Colors.white),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              game.eyebrow.toUpperCase(),
              style: textTheme.labelSmall?.copyWith(
                color: Colors.white.withOpacity(0.85),
                letterSpacing: 1.1,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              game.title,
              style: textTheme.headlineMedium?.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              game.description,
              style: textTheme.bodyLarge?.copyWith(
                color: Colors.white.withOpacity(0.92),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
