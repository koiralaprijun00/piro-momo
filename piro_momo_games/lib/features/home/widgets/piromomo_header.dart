import 'package:flutter/material.dart';
class PiromomoHeader extends StatelessWidget {
  const PiromomoHeader({
    super.key,
    this.streakDays = 7,
    this.appName = 'Welcome,',
    this.subtitle = 'Play quick trivia, stay close to Nepal.',
    this.referenceDate,
    this.gamesPlayed = 2,
    this.onProfilePressed,
    this.currentUserEmail,
    this.currentUserPhoto,
  });

  final int streakDays;
  final String appName;
  final String subtitle;
  final DateTime? referenceDate;
  final int gamesPlayed;
  final VoidCallback? onProfilePressed;
  final String? currentUserEmail;
  final String? currentUserPhoto;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;
    const EdgeInsets horizontalPadding = EdgeInsets.symmetric(horizontal: 24);

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
            currentUserEmail: currentUserEmail,
            currentUserPhoto: currentUserPhoto,
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
    this.currentUserEmail,
    this.currentUserPhoto,
  });

  final int streakDays;
  final String appName;
  final String subtitle;
  final ColorScheme colorScheme;
  final VoidCallback? onProfilePressed;
  final String? currentUserEmail;
  final String? currentUserPhoto;

  @override
  Widget build(BuildContext context) {
    final TextTheme textTheme = Theme.of(context).textTheme;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(12, 12, 12, 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: <Widget>[
              _ProfileIconButton(
                email: currentUserEmail,
                photoUrl: currentUserPhoto,
                onPressed:
                    onProfilePressed ?? () => debugPrint('Profile tapped'),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            appName,
            style: textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.w800,
              letterSpacing: -0.5,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            subtitle,
            style: textTheme.titleMedium?.copyWith(
              color: Colors.white.withOpacity(0.9),
              fontWeight: FontWeight.w600,
              height: 1.2,
            ),
          ),
        ],
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
      avatar = const Icon(Icons.person_rounded, color: Colors.white, size: 24);
    }

    return InkWell(
      borderRadius: BorderRadius.circular(32),
      onTap: onPressed,
      child: Container(
        height: 48,
        width: 48,
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.2),
          shape: BoxShape.circle,
          border: Border.all(
            color: Colors.white.withOpacity(0.3),
            width: 1,
          ),
        ),
        child: Center(child: avatar),
      ),
    );
  }
}
