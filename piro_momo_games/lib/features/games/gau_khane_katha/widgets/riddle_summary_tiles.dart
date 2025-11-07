import 'package:flutter/material.dart';

import '../../../../data/models/game_locale.dart';
import '../../festival/widgets/festival_stat_badge.dart';

class RiddleSummaryTiles extends StatelessWidget {
  const RiddleSummaryTiles({
    super.key,
    required this.score,
    required this.streak,
    required this.locale,
    required this.onRestart,
  });

  final int score;
  final int streak;
  final GameLocale locale;
  final VoidCallback onRestart;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Row(
          children: <Widget>[
            Text(
              locale == GameLocale.nepali ? 'सादा प्रगति' : 'Quick stats',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w700,
              ),
            ),
            const Spacer(),
            TextButton.icon(
              onPressed: onRestart,
              style: TextButton.styleFrom(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 10,
                ),
                shape: const StadiumBorder(),
              ),
              icon: const Icon(Icons.shuffle_rounded, size: 18),
              label: Text(
                locale == GameLocale.nepali ? 'फेरि खेलौं' : 'Shuffle riddles',
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 12,
          runSpacing: 10,
          children: <Widget>[
            FestivalStatBadge(
              label: 'Score',
              value: score.toString(),
              icon: Icons.auto_fix_high_rounded,
              compact: true,
            ),
            FestivalStatBadge(
              label: 'Streak',
              value: streak.toString(),
              icon: Icons.local_fire_department_rounded,
              compact: true,
            ),
          ],
        ),
      ],
    );
  }
}
