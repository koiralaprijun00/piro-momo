import 'package:flutter/material.dart';

import '../../../../core/theme/app_palette.dart';
import '../../../../data/models/game_locale.dart';
import '../../festival/widgets/festival_stat_badge.dart';
import '../../../home/data/game_definition.dart';

class RiddleSummaryTiles extends StatelessWidget {
  const RiddleSummaryTiles({
    super.key,
    required this.score,
    required this.streak,
    required this.bestStreak,
    required this.solved,
    required this.total,
    required this.attemptsLeft,
    required this.locale,
    required this.onRestart,
  });

  final int score;
  final int streak;
  final int bestStreak;
  final int solved;
  final int total;
  final int attemptsLeft;
  final GameLocale locale;
  final VoidCallback onRestart;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(
                    locale == GameLocale.nepali
                        ? 'गाई खाने कथा'
                        : 'Gau Khane Katha',
                    style: theme.textTheme.headlineSmall?.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    locale == GameLocale.nepali
                        ? 'पुराना नेपाली बुझाइ खेल — बुझ्नुहोस्, अनुमान लगाउनुहोस्, र नयाँ कथा सिक्नुहोस्।'
                        : 'Classic Nepali riddles — guess, learn, and keep the wit alive.',
                    style: theme.textTheme.bodyLarge?.copyWith(
                      color: Colors.white.withOpacity(0.92),
                      height: 1.55,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 20),
            CircleAvatar(
              radius: 28,
              backgroundColor: Colors.white.withOpacity(0.2),
              child: Icon(homeGames.last.icon, color: Colors.white),
            ),
          ],
        ),
        const SizedBox(height: 24),
        Wrap(
          spacing: 16,
          runSpacing: 12,
          children: <Widget>[
            FestivalStatBadge(
              label: 'Score',
              value: score.toString(),
              icon: Icons.auto_fix_high_rounded,
              color: Colors.white,
            ),
            FestivalStatBadge(
              label: 'Solved',
              value: '$solved / $total',
              icon: Icons.translate_rounded,
              color: Colors.greenAccent.shade100,
            ),
            FestivalStatBadge(
              label: 'Streak',
              value: streak.toString(),
              icon: Icons.local_fire_department_rounded,
              color: Colors.orange.shade200,
            ),
            FestivalStatBadge(
              label: 'Best',
              value: bestStreak.toString(),
              icon: Icons.military_tech_rounded,
              color: Colors.pink.shade100,
            ),
            FestivalStatBadge(
              label: 'Attempts left',
              value: '$attemptsLeft',
              icon: Icons.hourglass_top_rounded,
              color: AppPalette.lightBlue,
            ),
          ],
        ),
        const SizedBox(height: 20),
        FilledButton.tonalIcon(
          onPressed: onRestart,
          style: FilledButton.styleFrom(
            foregroundColor: Colors.white,
            backgroundColor: Colors.white.withOpacity(0.16),
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          ),
          icon: const Icon(Icons.refresh_rounded),
          label: Text(
            locale == GameLocale.nepali ? 'फेरि खेलौं' : 'Shuffle riddles',
          ),
        ),
      ],
    );
  }
}
