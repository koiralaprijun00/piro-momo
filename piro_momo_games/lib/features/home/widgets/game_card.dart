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
      borderRadius: BorderRadius.circular(20),
      child: Container(
        decoration: BoxDecoration(
          gradient: gradient,
          borderRadius: BorderRadius.circular(20),
          boxShadow: <BoxShadow>[
            BoxShadow(
              color: game.accentColors.first.withOpacity(0.25),
              blurRadius: 24,
              offset: const Offset(0, 18),
            ),
          ],
        ),
        padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 20),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
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
                  const SizedBox(height: 8),
                  Text(
                    game.description,
                    style: textTheme.bodyLarge?.copyWith(
                      color: Colors.white.withOpacity(0.92),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 18),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.22),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(game.icon, size: 24, color: Colors.white),
            ),
          ],
        ),
      ),
    );
  }
}
