import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../home/data/game_definition.dart';

class FestivalShellScreen extends StatelessWidget {
  const FestivalShellScreen({super.key});

  static const String routePath = '/games/guess-festival';

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    final ColorScheme colorScheme = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Guess the Festival'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => context.pop(),
        ),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Icon(homeGames.first.icon, size: 64, color: colorScheme.primary),
              const SizedBox(height: 24),
              Text(
                'Full festival gameplay coming in the next phase.',
                style: textTheme.headlineSmall,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              Text(
                'We are currently wiring up the question bank, progress tracking, and cultural insights.',
                style: textTheme.bodyLarge?.copyWith(
                  color: colorScheme.onBackground.withOpacity(0.7),
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
