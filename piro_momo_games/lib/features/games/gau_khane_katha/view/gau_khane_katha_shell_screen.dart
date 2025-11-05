import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../home/data/game_definition.dart';

class GauKhaneKathaShellScreen extends StatelessWidget {
  const GauKhaneKathaShellScreen({super.key});

  static const String routePath = '/games/gau-khane-katha';

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    final ColorScheme colorScheme = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Gau Khane Katha'),
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
              Icon(homeGames.last.icon, size: 64, color: colorScheme.secondary),
              const SizedBox(height: 24),
              Text(
                'Riddle gameplay screens are queued for the next milestones.',
                style: textTheme.headlineSmall,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              Text(
                'Expect bilingual riddles, streak tracking, and playful animations inspired by the web experience.',
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
