import 'package:flutter/material.dart';

class GlassHeader extends StatelessWidget {
  const GlassHeader({
    super.key,
    required this.title,
    required this.onBack,
    this.subtitle,
    this.stats = const [],
  });

  final String title;
  final VoidCallback onBack;
  final String? subtitle;
  final List<Widget> stats;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);

    return Container(
      margin: const EdgeInsets.only(top: 4),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.2),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 16,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Top row: Back button and Title
          Row(
            children: [
              // Back Button
              Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: onBack,
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.2),
                        width: 1,
                      ),
                    ),
                    child: const Icon(
                      Icons.arrow_back_ios_new_rounded,
                      color: Colors.white,
                      size: 16,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              // Title
              Expanded(
                child: Text(
                  title,
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                    fontSize: 18,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          // Bottom row: Subtitle (left) and Stats (right)
          if (subtitle != null || stats.isNotEmpty) ...[
            const SizedBox(height: 6),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                // Stats on the right
                if (stats.isNotEmpty)
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: stats.map((stat) {
                      return Padding(
                        padding: const EdgeInsets.only(left: 1),
                        child: Transform.scale(
                          scale: 0.85,
                          child: stat,
                        ),
                      );
                    }).toList(),
                  ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}
