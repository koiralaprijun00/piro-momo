import 'package:flutter/material.dart';

class PiromomoHeader extends StatelessWidget {
  const PiromomoHeader({
    super.key,
    this.streakDays = 7,
    this.appName = 'Piromomo',
    this.subtitle = 'Game of the year 2024',
    this.referenceDate,
    this.gamesPlayed = 2,
  });

  final int streakDays;
  final String appName;
  final String subtitle;
  final DateTime? referenceDate;
  final int gamesPlayed;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;
    const EdgeInsets horizontalPadding = EdgeInsets.symmetric(horizontal: 24);
    final DateTime resolvedDate = referenceDate ?? DateTime.now();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        const SizedBox(height: 36),
        Padding(
          padding: horizontalPadding,
          child: _HeroCard(
            streakDays: streakDays,
            appName: appName,
            subtitle: subtitle,
            colorScheme: colorScheme,
          ),
        ),
        const SizedBox(height: 20),
        Padding(
          padding: horizontalPadding,
          child: _DailyStatsRow(
            date: resolvedDate,
            streakDays: streakDays,
            gamesPlayed: gamesPlayed,
          ),
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
      padding: const EdgeInsets.fromLTRB(12, 32, 12, 16),
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
                  color: colorScheme.primary,
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
                    color: colorScheme.onSurface,
                  ),
                ),
              ),
              const SizedBox(height: 6),
              Text(
                subtitle,
                style: textTheme.headlineSmall?.copyWith(
                  color: colorScheme.onSurface.withOpacity(0.8),
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

class _DailyStatsRow extends StatelessWidget {
  const _DailyStatsRow({
    required this.date,
    required this.streakDays,
    required this.gamesPlayed,
  });

  final DateTime date;
  final int streakDays;
  final int gamesPlayed;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;
    final MaterialLocalizations localizations = MaterialLocalizations.of(
      context,
    );
    final String formattedDate = '${localizations.formatShortMonthDay(date)}.';
    final Color dividerColor = colorScheme.outlineVariant.withOpacity(0.5);

    return Material(
      color: Colors.transparent,
      child: Row(
        children: <Widget>[
          Expanded(
            child: _DailyStatTile(
              icon: Icons.calendar_today_rounded,
              iconColor: Colors.redAccent,
              value: formattedDate,
              label: 'Selected date',
            ),
          ),
          _DailyDivider(color: dividerColor),
          Expanded(
            child: _DailyStatTile(
              icon: Icons.bookmark_rounded,
              iconColor: Colors.orangeAccent,
              value: '$streakDays',
              label: 'Current streak',
            ),
          ),
          _DailyDivider(color: dividerColor),
          Expanded(
            child: _DailyStatTile(
              icon: Icons.check_box_outlined,
              iconColor: colorScheme.primary,
              value: '$gamesPlayed',
              label: 'Games to play',
            ),
          ),
        ],
      ),
    );
  }
}

class _DailyStatTile extends StatelessWidget {
  const _DailyStatTile({
    required this.icon,
    required this.iconColor,
    required this.value,
    required this.label,
  });

  final IconData icon;
  final Color iconColor;
  final String value;
  final String label;

  @override
  Widget build(BuildContext context) {
    final TextTheme textTheme = Theme.of(context).textTheme;
    final ColorScheme colorScheme = Theme.of(context).colorScheme;

    return Row(
      children: <Widget>[
        Icon(icon, color: iconColor, size: 20),
        const SizedBox(width: 8),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(
              value,
              style: textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w700,
                color: colorScheme.onSurface,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: textTheme.bodySmall?.copyWith(
                color: colorScheme.onSurfaceVariant,
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _DailyDivider extends StatelessWidget {
  const _DailyDivider({required this.color});

  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 1,
      height: 36,
      margin: const EdgeInsets.symmetric(horizontal: 16),
      color: color,
    );
  }
}

class _GradientText extends StatelessWidget {
  const _GradientText({required this.text, this.style});

  static const Gradient _gradient = LinearGradient(
    colors: <Color>[Color(0xFF7C3AED), Color(0xFFA855F7)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  final String text;
  final TextStyle? style;

  @override
  Widget build(BuildContext context) {
    return ShaderMask(
      shaderCallback: (Rect bounds) => _gradient.createShader(
        Rect.fromLTWH(0, 0, bounds.width, bounds.height),
      ),
      blendMode: BlendMode.srcIn,
      child: Text(text, style: style),
    );
  }
}
