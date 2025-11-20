import 'package:flutter/material.dart';

class PiromomoHeader extends StatelessWidget {
  const PiromomoHeader({
    super.key,
    this.streakDays = 7,
    this.appName = 'Piromomo',
    this.subtitle = 'Play quick trivia, stay close to Nepal.',
    this.referenceDate,
    this.gamesPlayed = 2,
    this.onProfilePressed,
    this.onNotificationsPressed,
    this.currentUserEmail,
    this.currentUserPhoto,
  });

  final int streakDays;
  final String appName;
  final String subtitle;
  final DateTime? referenceDate;
  final int gamesPlayed;
  final VoidCallback? onProfilePressed;
  final VoidCallback? onNotificationsPressed;
  final String? currentUserEmail;
  final String? currentUserPhoto;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;
    const EdgeInsets horizontalPadding = EdgeInsets.symmetric(horizontal: 24);
    final DateTime resolvedDate = referenceDate ?? DateTime.now();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        const SizedBox(height: 6),
        Padding(
          padding: horizontalPadding,
          child: _HeroCard(
            streakDays: streakDays,
            appName: appName,
            subtitle: subtitle,
            colorScheme: colorScheme,
            onProfilePressed: onProfilePressed,
            onNotificationsPressed: onNotificationsPressed,
            currentUserEmail: currentUserEmail,
            currentUserPhoto: currentUserPhoto,
          ),
        ),
        const SizedBox(height: 12),
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
    this.onProfilePressed,
    this.onNotificationsPressed,
    this.currentUserEmail,
    this.currentUserPhoto,
  });

  final int streakDays;
  final String appName;
  final String subtitle;
  final ColorScheme colorScheme;
  final VoidCallback? onProfilePressed;
  final VoidCallback? onNotificationsPressed;
  final String? currentUserEmail;
  final String? currentUserPhoto;

  @override
  Widget build(BuildContext context) {
    final TextTheme textTheme = Theme.of(context).textTheme;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(12, 22, 12, 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              Expanded(
                child: Text(
                  'Streak: $streakDays days',
                  style: textTheme.titleSmall?.copyWith(
                    color: colorScheme.primary,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.4,
                  ),
                ),
              ),
              _HeroIconButton(
                icon: Icons.notifications_none_rounded,
                onPressed: onNotificationsPressed ??
                    () => debugPrint('Notifications tapped'),
              ),
              const SizedBox(width: 12),
              _ProfileIconButton(
                email: currentUserEmail,
                photoUrl: currentUserPhoto,
                onPressed:
                    onProfilePressed ?? () => debugPrint('Profile tapped'),
              ),
            ],
          ),
          const SizedBox(height: 10),
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
          const SizedBox(height: 2),
          Text(
            subtitle,
            style: textTheme.titleMedium?.copyWith(
              fontSize: 12,
              color: colorScheme.onSurface.withValues(alpha: 0.7),
              fontWeight: FontWeight.w500,
              height: 1.25,
            ),
          ),
        ],
      ),
    );
  }
}

class _HeroIconButton extends StatelessWidget {
  const _HeroIconButton({required this.icon, required this.onPressed});

  final IconData icon;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    final ColorScheme colorScheme = Theme.of(context).colorScheme;

    return InkWell(
      borderRadius: BorderRadius.circular(32),
      onTap: onPressed,
      child: Container(
        height: 40,
        width: 40,
        decoration: BoxDecoration(
          color: colorScheme.surfaceVariant,
          borderRadius: BorderRadius.circular(32),
        ),
        child: Icon(icon, color: colorScheme.onSurfaceVariant, size: 20),
      ),
    );
  }
}

class _ProfileIconButton extends StatelessWidget {
  const _ProfileIconButton({
    required this.onPressed,
    this.email,
    this.photoUrl,
  });

  final VoidCallback onPressed;
  final String? email;
  final String? photoUrl;

  @override
  Widget build(BuildContext context) {
    final ColorScheme colorScheme = Theme.of(context).colorScheme;
    final String? initial = email?.isNotEmpty == true
        ? email!.substring(0, 1).toUpperCase()
        : null;

    Widget avatar;
    if (photoUrl != null && photoUrl!.isNotEmpty) {
      avatar = CircleAvatar(
        backgroundImage: NetworkImage(photoUrl!),
        radius: 18,
      );
    } else if (initial != null) {
      avatar = CircleAvatar(
        radius: 18,
        backgroundColor: colorScheme.primary,
        child: Text(
          initial,
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                color: colorScheme.onPrimary,
                fontWeight: FontWeight.bold,
              ),
        ),
      );
    } else {
      avatar = Icon(Icons.person_outline_rounded,
          color: colorScheme.onSurfaceVariant, size: 20);
    }

    return InkWell(
      borderRadius: BorderRadius.circular(32),
      onTap: onPressed,
      child: Container(
        height: 40,
        width: 40,
        decoration: BoxDecoration(
          color: colorScheme.surfaceVariant,
          borderRadius: BorderRadius.circular(32),
        ),
        child: Center(child: avatar),
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
    final Color dividerColor = colorScheme.outlineVariant.withValues(
      alpha: 0.5,
    );

    return Material(
      color: Colors.transparent,
      child: Row(
        children: <Widget>[
          Expanded(
            child: _DailyStatTile(
              icon: Icons.calendar_today_rounded,
              iconColor: Colors.redAccent,
              value: formattedDate,
              label: 'Date',
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
              label: 'Games',
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
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Padding(
          padding: const EdgeInsets.only(top: 2),
          child: Icon(icon, color: iconColor, size: 18),
        ),
        const SizedBox(width: 6),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(
              value,
              style: textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.w700,
                color: colorScheme.onSurface,
              ),
            ),
            const SizedBox(height: 1),
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
      height: 32,
      margin: const EdgeInsets.symmetric(horizontal: 12),
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
