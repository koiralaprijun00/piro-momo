import 'package:flutter/material.dart';

class QuizOptionTile extends StatefulWidget {
  const QuizOptionTile({
    super.key,
    required this.label,
    required this.leadingLabel,
    required this.onPressed,
    this.isSelected = false,
    this.isDisabled = false,
    this.showCorrectState = false,
    this.showIncorrectState = false,
    this.correctLabel,
    this.incorrectLabel,
    this.factText,
  });

  final String label;
  final String leadingLabel;
  final VoidCallback onPressed;
  final bool isSelected;
  final bool isDisabled;
  final bool showCorrectState;
  final bool showIncorrectState;
  final String? correctLabel;
  final String? incorrectLabel;
  final String? factText;

  @override
  State<QuizOptionTile> createState() => _QuizOptionTileState();
}

class _QuizOptionTileState extends State<QuizOptionTile> {
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

    final bool showResult =
        widget.showCorrectState || widget.showIncorrectState;
    final bool showFact =
        widget.factText != null && widget.factText!.trim().isNotEmpty;

    Color backgroundColor = Colors.white;
    Color borderColor = colorScheme.outlineVariant.withOpacity(0.4);
    Color titleColor = colorScheme.onSurface;
    IconData? statusIcon;
    Color? statusColor;
    String? statusText;

    if (widget.showCorrectState) {
      backgroundColor = const Color(0xFFDFF7E3);
      borderColor = const Color(0xFF22C55E);
      titleColor = const Color(0xFF14532D);
      statusIcon = Icons.check_rounded;
      statusColor = const Color(0xFF15803D);
      statusText = widget.correctLabel ?? 'Correct!';
    } else if (widget.showIncorrectState) {
      backgroundColor = const Color(0xFFFEE2E2);
      borderColor = const Color(0xFFEF4444);
      titleColor = const Color(0xFF991B1B);
      statusIcon = Icons.close_rounded;
      statusColor = const Color(0xFFB91C1C);
      statusText = widget.incorrectLabel ?? 'Not quite';
    } else if (widget.isSelected) {
      backgroundColor = colorScheme.primary.withOpacity(0.08);
      borderColor = colorScheme.primary;
      titleColor = colorScheme.primary;
    } else if (_isHovered) {
      backgroundColor = colorScheme.surfaceVariant.withOpacity(0.6);
    }

    final bool showShadow =
        (_isHovered || widget.isSelected) && !widget.isDisabled && !showResult;

    final BorderRadius borderRadius = BorderRadius.circular(22);
    final double targetScale =
        widget.showCorrectState || widget.showIncorrectState ? 1.02 : 1.0;
    final double pressedScale = _isPressed ? 0.985 : 1.0;

    return MouseRegion(
      onEnter: (_) => _handleHover(true),
      onExit: (_) => _handleHover(false),
      child: AnimatedScale(
        scale: targetScale * pressedScale,
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeOut,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 240),
          curve: Curves.easeOutCubic,
          decoration: BoxDecoration(
            color: backgroundColor,
            borderRadius: borderRadius,
            border: Border.all(color: borderColor, width: 1.4),
            boxShadow: showShadow
                ? <BoxShadow>[
                    BoxShadow(
                      color: colorScheme.shadow.withOpacity(0.08),
                      blurRadius: 18,
                      offset: const Offset(0, 12),
                    ),
                  ]
                : null,
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              borderRadius: borderRadius,
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
                padding: const EdgeInsets.symmetric(
                  horizontal: 22,
                  vertical: 18,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        AnimatedOpacity(
                          duration: const Duration(milliseconds: 220),
                          opacity: widget.showCorrectState ? 1 : 0.4,
                          child: Text(
                            widget.leadingLabel,
                            style: theme.textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.w700,
                              color: titleColor.withOpacity(0.9),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            widget.label,
                            style: theme.textTheme.titleMedium?.copyWith(
                              color: titleColor,
                              fontWeight: FontWeight.w600,
                              height: 1.35,
                            ),
                          ),
                        ),
                        AnimatedSwitcher(
                          duration: const Duration(milliseconds: 220),
                          transitionBuilder:
                              (Widget child, Animation<double> animation) {
                                return FadeTransition(
                                  opacity: animation,
                                  child: child,
                                );
                              },
                          child: widget.showCorrectState
                              ? Icon(
                                  Icons.check_rounded,
                                  key: const ValueKey<String>('check'),
                                  size: 22,
                                  color: statusColor ?? titleColor,
                                )
                              : widget.showIncorrectState
                              ? Icon(
                                  Icons.close_rounded,
                                  key: const ValueKey<String>('close'),
                                  size: 22,
                                  color: statusColor ?? titleColor,
                                )
                              : const SizedBox.shrink(),
                        ),
                      ],
                    ),
                    AnimatedSwitcher(
                      duration: const Duration(milliseconds: 320),
                      transitionBuilder:
                          (Widget child, Animation<double> animation) {
                            final Animation<double> curved = CurvedAnimation(
                              parent: animation,
                              curve: Curves.easeOut,
                            );
                            return FadeTransition(
                              opacity: curved,
                              child: SizeTransition(
                                sizeFactor: curved,
                                axisAlignment: -1,
                                child: FadeTransition(
                                  opacity: curved,
                                  child: child,
                                ),
                              ),
                            );
                          },
                      child: statusText != null
                          ? Padding(
                              key: const ValueKey<String>('status'),
                              padding: const EdgeInsets.only(top: 10),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: <Widget>[
                                  Icon(
                                    statusIcon,
                                    size: 20,
                                    color: statusColor,
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      statusText,
                                      style: theme.textTheme.titleMedium
                                          ?.copyWith(
                                            color: statusColor,
                                            fontWeight: FontWeight.w700,
                                          ),
                                    ),
                                  ),
                                ],
                              ),
                            )
                          : const SizedBox.shrink(),
                    ),
                    AnimatedSwitcher(
                      duration: const Duration(milliseconds: 360),
                      transitionBuilder:
                          (Widget child, Animation<double> animation) {
                            final Animation<double> curved = CurvedAnimation(
                              parent: animation,
                              curve: Curves.easeOut,
                            );
                            return FadeTransition(
                              opacity: curved,
                              child: SizeTransition(
                                sizeFactor: curved,
                                axisAlignment: -1,
                                child: FadeTransition(
                                  opacity: curved,
                                  child: child,
                                ),
                              ),
                            );
                          },
                      child: showFact
                          ? Padding(
                              key: ValueKey<String>('fact-${widget.label}'),
                              padding: const EdgeInsets.only(top: 10),
                              child: Text(
                                widget.factText!,
                                style: theme.textTheme.bodyMedium?.copyWith(
                                  color: titleColor.withOpacity(
                                    widget.showCorrectState ? 0.95 : 0.85,
                                  ),
                                  height: 1.5,
                                ),
                              ),
                            )
                          : const SizedBox.shrink(),
                    ),
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
