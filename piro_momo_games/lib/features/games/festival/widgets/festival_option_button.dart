import 'package:flutter/material.dart';

class FestivalOptionButton extends StatefulWidget {
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
  State<FestivalOptionButton> createState() => _FestivalOptionButtonState();
}

class _FestivalOptionButtonState extends State<FestivalOptionButton> {
  bool _isHovered = false;
  bool _isPressed = false;

  void _handleHover(bool hovering) {
    if (!mounted || widget.isDisabled) {
      return;
    }
    setState(() {
      _isHovered = hovering;
    });
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;

    final bool showResult = widget.isSelected || widget.isCorrectAnswer;
    Color backgroundColor = colorScheme.surface;
    Color borderColor = colorScheme.outlineVariant;
    Color textColor = colorScheme.onSurface;
    IconData? icon;
    Color? iconColor;

    if (showResult) {
      if (widget.isCorrectAnswer) {
        backgroundColor = colorScheme.primary.withOpacity(0.15);
        borderColor = colorScheme.primary;
        textColor = colorScheme.primary;
        icon = Icons.check_circle_rounded;
        iconColor = colorScheme.primary;
      } else if (widget.isSelected) {
        backgroundColor = colorScheme.error.withOpacity(0.12);
        borderColor = colorScheme.error;
        textColor = colorScheme.error;
        icon = Icons.highlight_off_rounded;
        iconColor = colorScheme.error;
      }
    } else if (widget.isSelected) {
      backgroundColor = colorScheme.primary.withOpacity(0.08);
      borderColor = colorScheme.primary;
      textColor = colorScheme.primary;
    }

    if (!showResult && _isHovered) {
      backgroundColor = colorScheme.surfaceVariant.withOpacity(0.75);
    }

    final bool showShadow =
        (_isHovered || widget.isSelected) && !widget.isDisabled && !showResult;

    return MouseRegion(
      onEnter: (_) => _handleHover(true),
      onExit: (_) => _handleHover(false),
      child: AnimatedScale(
        scale: _isPressed ? 0.98 : 1,
        duration: const Duration(milliseconds: 140),
        curve: Curves.easeOut,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 220),
          curve: Curves.easeOutCubic,
          decoration: BoxDecoration(
            color: backgroundColor,
            borderRadius: BorderRadius.circular(26),
            border: Border.all(color: borderColor, width: 1.6),
            boxShadow: showShadow
                ? <BoxShadow>[
                    BoxShadow(
                      color: colorScheme.shadow.withOpacity(0.08),
                      blurRadius: 24,
                      offset: const Offset(0, 12),
                    ),
                  ]
                : null,
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              borderRadius: BorderRadius.circular(26),
              onTap: widget.isDisabled ? null : widget.onPressed,
              onHighlightChanged: (bool value) {
                if (!mounted || widget.isDisabled) {
                  return;
                }
                setState(() {
                  _isPressed = value;
                });
              },
              child: Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 22, vertical: 18),
                child: Row(
                  children: <Widget>[
                    Expanded(
                      child: Text(
                        widget.label,
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
        ),
      ),
    );
  }
}
