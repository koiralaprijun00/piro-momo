import 'package:flutter/material.dart';

class FestivalStatBadge extends StatelessWidget {
  const FestivalStatBadge({
    super.key,
    required this.label,
    required this.value,
    this.icon,
    this.color,
    this.backgroundColor,
    this.compact = false,
  });

  final String label;
  final String value;
  final IconData? icon;
  final Color? color;
  final Color? backgroundColor;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;
    final Color resolvedColor = color ?? colorScheme.onSurface;
    final Color resolvedBackground =
        backgroundColor ?? resolvedColor.withOpacity(0.12);
    final EdgeInsets resolvedPadding = compact
        ? const EdgeInsets.symmetric(horizontal: 14, vertical: 8)
        : const EdgeInsets.symmetric(horizontal: 18, vertical: 12);
    final double iconSize = compact ? 18 : 20;

    return Semantics(
      label: '$label $value',
      child: Container(
        padding: resolvedPadding,
        decoration: BoxDecoration(
          color: resolvedBackground,
          borderRadius: BorderRadius.circular(999),
          border: Border.all(color: resolvedColor.withOpacity(0.3)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            if (icon != null) Icon(icon, size: iconSize, color: resolvedColor),
            if (icon != null) SizedBox(width: compact ? 8 : 10),
            Text(
              value,
              style:
                  (compact
                          ? theme.textTheme.titleSmall
                          : theme.textTheme.titleMedium)
                      ?.copyWith(
                        color: resolvedColor,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 0.2,
                      ),
            ),
          ],
        ),
      ),
    );
  }
}
