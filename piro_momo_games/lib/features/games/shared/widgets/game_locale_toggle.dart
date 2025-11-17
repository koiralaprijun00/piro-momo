import 'package:flutter/material.dart';

import '../../../../data/models/game_locale.dart';

class GameLocaleToggle extends StatelessWidget {
  const GameLocaleToggle({
    super.key,
    required this.currentLocale,
    required this.onChanged,
  });

  final GameLocale currentLocale;
  final ValueChanged<GameLocale> onChanged;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);

    return SegmentedButton<GameLocale>(
      showSelectedIcon: false,
      style: ButtonStyle(
        visualDensity: VisualDensity.compact,
        padding: const WidgetStatePropertyAll<EdgeInsets>(
          EdgeInsets.symmetric(horizontal: 6),
        ),
        textStyle: WidgetStatePropertyAll<TextStyle?>(
          theme.textTheme.labelSmall?.copyWith(
            fontWeight: FontWeight.w600,
            letterSpacing: 0.2,
          ),
        ),
      ),
      segments: const <ButtonSegment<GameLocale>>[
        ButtonSegment<GameLocale>(
          value: GameLocale.english,
          label: Text('EN'),
        ),
        ButtonSegment<GameLocale>(
          value: GameLocale.nepali,
          label: Text('NP'),
        ),
      ],
      selected: <GameLocale>{currentLocale},
      onSelectionChanged: (Set<GameLocale> newSelection) {
        if (newSelection.isEmpty) {
          return;
        }
        onChanged(newSelection.first);
      },
    );
  }
}
