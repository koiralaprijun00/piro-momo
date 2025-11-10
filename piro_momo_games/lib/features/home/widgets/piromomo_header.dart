import 'package:flutter/material.dart';

class QuickItemData {
  final String id;
  final String label;
  final IconData icon;
  final VoidCallback? onPressed;

  const QuickItemData({
    required this.id,
    required this.label,
    required this.icon,
    this.onPressed,
  });
}

class PiromomoHeader extends StatelessWidget {
  const PiromomoHeader({
    super.key,
    this.streakDays = 7,
    this.appName = 'Piromomo',
    this.subtitle = 'Game of the year 2024',
    this.quickItems,
    this.onShowAll,
  });

  final int streakDays;
  final String appName;
  final String subtitle;
  final List<QuickItemData>? quickItems;
  final VoidCallback? onShowAll;

  static List<QuickItemData> get _defaultQuickItems => <QuickItemData>[
        QuickItemData(
          id: 'festivals',
          label: 'Festivals',
          icon: Icons.celebration,
          onPressed: () => debugPrint('Open Festivals'),
        ),
        QuickItemData(
          id: 'kings',
          label: 'Kings',
          icon: Icons.emoji_events,
          onPressed: () => debugPrint('Open Kings'),
        ),
        QuickItemData(
          id: 'districts',
          label: 'Districts',
          icon: Icons.map,
          onPressed: () => debugPrint('Open Districts'),
        ),
        QuickItemData(
          id: 'quiz',
          label: 'Quiz',
          icon: Icons.psychology_alt,
          onPressed: () => debugPrint('Open Quiz'),
        ),
      ];

  List<QuickItemData> get _resolvedQuickItems {
    final List<QuickItemData>? provided = quickItems;
    if (provided == null || provided.isEmpty) {
      return _defaultQuickItems;
    }
    return provided;
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;
    final List<QuickItemData> items = _resolvedQuickItems;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        const SizedBox(height: 36),
        _HeroCard(
          streakDays: streakDays,
          appName: appName,
          subtitle: subtitle,
          colorScheme: colorScheme,
        ),
        _QuickPlaySection(
          items: items,
          onShowAll: onShowAll ?? () => debugPrint('Show all quick games'),
        ),
      ],
    );
  }
}

class _HeroCard extends StatelessWidget {
  const _HeroCard({
    required this.streakDays,
    required this.appName,
    required this.subtitle,
    required this.colorScheme,
  });

  final int streakDays;
  final String appName;
  final String subtitle;
  final ColorScheme colorScheme;

  @override
  Widget build(BuildContext context) {
    final TextTheme textTheme = Theme.of(context).textTheme;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(20, 48, 20, 32),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: <Color>[
            Color(0xFF1F1147),
            Color(0xFF6A0572),
            Color(0xFFB62D68),
            Color(0xFFFF7A18),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Stack(
        children: <Widget>[
          Positioned(
            top: 0,
            right: 0,
            child: _NotificationsPill(colorScheme: colorScheme),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(
                'Streak: $streakDays days',
                style: textTheme.titleSmall?.copyWith(
                  color: Colors.white70,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.4,
                ),
              ),
              const SizedBox(height: 20),
              FittedBox(
                fit: BoxFit.scaleDown,
                alignment: Alignment.centerLeft,
                child: _GradientText(
                  text: appName,
                  style: textTheme.displaySmall?.copyWith(
                    fontWeight: FontWeight.w800,
                    letterSpacing: -0.8,
                    color: Colors.white,
                  ),
                ),
              ),
              const SizedBox(height: 6),
              Text(
                subtitle,
                style: textTheme.headlineSmall?.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _NotificationsPill extends StatelessWidget {
  const _NotificationsPill({required this.colorScheme});

  final ColorScheme colorScheme;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: 'Notifications',
      child: InkWell(
        onTap: () => debugPrint('Notifications tapped'),
        borderRadius: BorderRadius.circular(24),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.92),
            borderRadius: BorderRadius.circular(999),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Text(
                'Notifications',
                style: Theme.of(context).textTheme.labelLarge?.copyWith(
                      color: colorScheme.primary,
                      fontWeight: FontWeight.w600,
                    ),
              ),
              const SizedBox(width: 8),
              CircleAvatar(
                radius: 14,
                backgroundColor: Colors.white,
                child: Icon(
                  Icons.tag_faces,
                  color: colorScheme.primary,
                  size: 16,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _QuickPlaySection extends StatelessWidget {
  const _QuickPlaySection({
    required this.items,
    required this.onShowAll,
  });

  final List<QuickItemData> items;
  final VoidCallback onShowAll;

  @override
  Widget build(BuildContext context) {
    final Color background = const Color(0xFF020617);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(0, 32, 0, 32),
      decoration: BoxDecoration(
        color: background,
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 40),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Row(
              children: <Widget>[
                Text(
                  'Quick play',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                      ),
                ),
                const Spacer(),
                TextButton(
                  onPressed: onShowAll,
                  style: TextButton.styleFrom(
                    foregroundColor: const Color(0xFF38BDF8),
                    textStyle: Theme.of(context).textTheme.labelLarge?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                    visualDensity: VisualDensity.compact,
                  ),
                  child: const Text('Show all'),
                ),
              ],
            ),
            const SizedBox(height: 16),
            LayoutBuilder(
              builder: (BuildContext context, BoxConstraints constraints) {
                final List<Widget> children = items
                    .map((QuickItemData item) => _QuickShortcut(item: item))
                    .toList();

                if (children.length == 4 && constraints.maxWidth >= 320) {
                  return Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: children,
                  );
                }

                return Wrap(
                  spacing: 20,
                  runSpacing: 20,
                  alignment: WrapAlignment.spaceEvenly,
                  children: children,
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _QuickShortcut extends StatelessWidget {
  const _QuickShortcut({required this.item});

  final QuickItemData item;

  @override
  Widget build(BuildContext context) {
    final TextTheme textTheme = Theme.of(context).textTheme;
    final VoidCallback onPressed =
        item.onPressed ?? () => debugPrint('Open ${item.label}');

    return Semantics(
      button: true,
      label: 'Open ${item.label}',
      child: InkWell(
        onTap: onPressed,
        borderRadius: BorderRadius.circular(48),
        child: SizedBox(
          width: 64,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Container(
                height: 50,
                width: 50,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(48),
                  boxShadow: <BoxShadow>[
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.08),
                      blurRadius: 12,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Icon(
                  item.icon,
                  size: 22,
                  color: const Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                item.label,
                textAlign: TextAlign.center,
                overflow: TextOverflow.ellipsis,
                style: textTheme.bodySmall?.copyWith(
                  color: Colors.white,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _GradientText extends StatelessWidget {
  const _GradientText({
    required this.text,
    this.style,
  });

  static const Gradient _gradient = LinearGradient(
    colors: <Color>[
      Color(0xFF7C3AED),
      Color(0xFFA855F7),
    ],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  final String text;
  final TextStyle? style;

  @override
  Widget build(BuildContext context) {
    return ShaderMask(
      shaderCallback: (Rect bounds) => _gradient
          .createShader(Rect.fromLTWH(0, 0, bounds.width, bounds.height)),
      blendMode: BlendMode.srcIn,
      child: Text(
        text,
        style: style,
      ),
    );
  }
}
