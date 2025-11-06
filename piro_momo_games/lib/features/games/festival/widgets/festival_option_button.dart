import 'package:flutter/material.dart';

class FestivalOptionButton extends StatelessWidget {
  const FestivalOptionButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.isSelected = false,
    this.isCorrectAnswer = false,
    this.isDisabled = false,
  });

  final String label;
  final VoidCallback onPressed;
  final bool isSelected;
  final bool isCorrectAnswer;
  final bool isDisabled;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;

    final bool showResult = isSelected || isCorrectAnswer;
    Color backgroundColor = colorScheme.surface;
    Color borderColor = colorScheme.outlineVariant;
    Color textColor = colorScheme.onSurface;
    IconData? icon;
    Color? iconColor;

    if (showResult) {
      if (isCorrectAnswer) {
        backgroundColor = colorScheme.primary.withOpacity(0.15);
        borderColor = colorScheme.primary;
        textColor = colorScheme.primary;
        icon = Icons.check_circle_rounded;
        iconColor = colorScheme.primary;
      } else if (isSelected) {
        backgroundColor = colorScheme.error.withOpacity(0.12);
        borderColor = colorScheme.error;
        textColor = colorScheme.error;
        icon = Icons.highlight_off_rounded;
        iconColor = colorScheme.error;
      }
    } else if (isSelected) {
      backgroundColor = colorScheme.primary.withOpacity(0.08);
      borderColor = colorScheme.primary;
      textColor = colorScheme.primary;
    }

    return AnimatedContainer(
      duration: const Duration(milliseconds: 220),
      curve: Curves.easeInOut,
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: borderColor, width: 1.6),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: isDisabled ? null : onPressed,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
            child: Row(
              children: <Widget>[
                Expanded(
                  child: Text(
                    label,
                    style: theme.textTheme.titleMedium?.copyWith(
                      color: textColor,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                if (icon != null) Icon(icon, color: iconColor, size: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
