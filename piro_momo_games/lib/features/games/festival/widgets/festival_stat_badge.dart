import 'package:flutter/material.dart';

class FestivalStatBadge extends StatelessWidget {
  const FestivalStatBadge({
    super.key,
    required this.label,
    required this.value,
    this.icon,
    this.color,
    this.compact = false,
  });

  final String label;
  final String value;
  final IconData? icon;
  final Color? color;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;
    final Color resolvedColor = color ?? colorScheme.primary;
    final EdgeInsets resolvedPadding = compact
        ? const EdgeInsets.symmetric(horizontal: 14, vertical: 10)
        : const EdgeInsets.symmetric(horizontal: 16, vertical: 12);
    final double iconSize = compact ? 18 : 20;
    final TextStyle? labelStyle = compact
        ? theme.textTheme.labelSmall?.copyWith(
            color: resolvedColor,
            letterSpacing: 1.1,
          )
        : theme.textTheme.labelSmall?.copyWith(
            color: resolvedColor,
            letterSpacing: 1.2,
          );
    final TextStyle? valueStyle = compact
        ? theme.textTheme.titleSmall?.copyWith(
            color: resolvedColor,
            fontWeight: FontWeight.w700,
          )
        : theme.textTheme.titleMedium?.copyWith(
            color: resolvedColor,
            fontWeight: FontWeight.w700,
          );

    return Container(
      padding: resolvedPadding,
      decoration: BoxDecoration(
        color: resolvedColor.withOpacity(0.12),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: resolvedColor.withOpacity(0.35)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          if (icon != null) Icon(icon, size: iconSize, color: resolvedColor),
          if (icon != null)
            SizedBox(width: compact ? 8 : 10),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Text(
                label.toUpperCase(),
                style: labelStyle,
              ),
              SizedBox(height: compact ? 0 : 2),
              Text(
                value,
                style: valueStyle,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
