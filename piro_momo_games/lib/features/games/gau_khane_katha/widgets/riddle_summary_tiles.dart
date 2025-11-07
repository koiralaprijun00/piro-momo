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
    final colorScheme = theme.colorScheme;

    return Container(
      margin: const EdgeInsets.only(top: 4),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: colorScheme.surface.withOpacity(0.7),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: colorScheme.outlineVariant.withOpacity(0.35)),
        boxShadow: <BoxShadow>[
          BoxShadow(
            color: colorScheme.shadow.withOpacity(0.06),
            blurRadius: 18,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
          final bool isTight = constraints.maxWidth < 360;
          final String tooltipLabel =
              locale == GameLocale.nepali ? 'फेरि खेलौं' : 'Shuffle riddles';

          return Row(
            children: <Widget>[
              Expanded(
                child: Wrap(
                  spacing: 10,
                  runSpacing: 8,
                  crossAxisAlignment: WrapCrossAlignment.center,
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
              ),
              Tooltip(
                message: tooltipLabel,
                child: IconButton.filledTonal(
                  onPressed: onRestart,
                  icon: const Icon(Icons.shuffle_rounded),
                  iconSize: 18,
                  style: IconButton.styleFrom(
                    padding: EdgeInsets.symmetric(
                      horizontal: isTight ? 10 : 14,
                      vertical: 10,
                    ),
                    shape: const StadiumBorder(),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
