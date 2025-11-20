import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../auth/data/auth_service.dart';
import '../../auth/providers/auth_providers.dart';

class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  static const String routePath = '/profile';

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();
  bool _busy = false;
  String? _error;
  bool _showSignUp = false;
  bool _closeAfterAuth = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _guard(Future<void> Function() task) async {
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      await task();
    } on FirebaseAuthException catch (error) {
      setState(() {
        _error = error.message ?? error.code;
      });
    } catch (error) {
      setState(() {
        _error = error.toString();
      });
    } finally {
      if (mounted) {
        setState(() => _busy = false);
      }
    }
  }

  Future<void> _startAuthFlow(Future<void> Function() task) async {
    setState(() {
      _closeAfterAuth = true;
    });
    await _guard(task);
  }

  Future<void> _signUp(AuthService service) async {
    final String password = _passwordController.text;
    final String confirm = _confirmPasswordController.text;
    if (password.isEmpty) {
      setState(() => _error = 'Password cannot be empty');
      return;
    }
    if (password != confirm) {
      setState(() => _error = 'Passwords do not match');
      return;
    }
    await service.signUpWithEmail(
      email: _emailController.text.trim(),
      password: password,
    );
    if (mounted) {
      setState(() => _showSignUp = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;
    final AsyncValue<User?> userValue = ref.watch(authStateProvider);
    final AuthService authService = ref.watch(authServiceProvider);

    return Scaffold(
      body: SafeArea(
        child: Container(
          width: double.infinity,
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: <Color>[
                Color(0xFFF6F3FF),
                Color(0xFFE0F2FE),
                Color(0xFFFFF1F2),
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 440),
              child: Card(
                elevation: 4,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(28),
                ),
                margin: const EdgeInsets.symmetric(horizontal: 24),
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(24, 28, 24, 32),
                  child: userValue.when(
                    data: (User? user) => _buildBody(
                      context,
                      theme,
                      colorScheme,
                      authService,
                      user,
                    ),
                    error: (Object error, StackTrace stackTrace) => Text(
                      'Unable to load profile: $error',
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: colorScheme.error,
                      ),
                    ),
                    loading: () => const Center(
                      child: CircularProgressIndicator(),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBody(
    BuildContext context,
    ThemeData theme,
    ColorScheme colorScheme,
    AuthService authService,
    User? user,
  ) {
    if (_closeAfterAuth && user != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (!mounted) {
          return;
        }
        if (Navigator.of(context).canPop()) {
          Navigator.of(context).pop();
        }
      });
      _closeAfterAuth = false;
      return const SizedBox.shrink();
    }
    if (user != null) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Row(
            children: <Widget>[
              IconButton(
                icon: const Icon(Icons.arrow_back_ios_new_rounded),
                onPressed: () => Navigator.of(context).maybePop(),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  'Profile',
                  style: theme.textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
              IconButton(
                onPressed: () {},
                icon: const Icon(Icons.favorite_border),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: colorScheme.surfaceVariant.withValues(alpha: 0.3),
              borderRadius: BorderRadius.circular(24),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    CircleAvatar(
                      radius: 35,
                      backgroundColor:
                          colorScheme.primary.withValues(alpha: 0.15),
                      backgroundImage: user.photoURL != null
                          ? NetworkImage(user.photoURL!)
                          : null,
                      child: user.photoURL == null
                          ? Text(
                              (user.displayName ?? user.email ?? '?')
                                  .substring(0, 1)
                                  .toUpperCase(),
                              style: theme.textTheme.headlineMedium?.copyWith(
                                color: colorScheme.primary,
                                fontWeight: FontWeight.w800,
                              ),
                            )
                          : null,
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: <Widget>[
                              Text(
                                user.displayName ?? 'Piromomo Player',
                                style: theme.textTheme.titleLarge?.copyWith(
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              const Icon(Icons.verified, color: Colors.blue),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            user.email ?? 'Email not provided',
                            style: theme.textTheme.bodyMedium?.copyWith(
                              color: colorScheme.onSurfaceVariant,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Piromomo Explorer',
                            style: theme.textTheme.bodySmall?.copyWith(
                              color: colorScheme.onSurfaceVariant,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    _ProfileStatTile(
                      icon: Icons.local_fire_department_rounded,
                      label: 'Streak',
                      value: 'Current streak',
                    ),
                    _ProfileStatTile(
                      icon: Icons.military_tech_rounded,
                      label: 'High score',
                      value: 'Best runs',
                    ),
                    _ProfileStatTile(
                      icon: Icons.workspace_premium_rounded,
                      label: 'Badges',
                      value: '${user.providerData.length}',
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          Wrap(
            spacing: 12,
            children: <Widget>[
              _ProfileChip(
                icon: Icons.person,
                label: 'About me',
                active: true,
              ),
              _ProfileChip(
                icon: Icons.star_border_rounded,
                label: 'Achievements',
              ),
              _ProfileChip(
                icon: Icons.favorite_border_rounded,
                label: 'Wishlist',
              ),
            ],
          ),
          const SizedBox(height: 20),
          Text(
            'Short bio',
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'A curious lifelong learner. Loves conquering Nepali trivia while sipping coffee.',
            style: theme.textTheme.bodyMedium?.copyWith(
              color: colorScheme.onSurfaceVariant,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 20),
          Text(
            'I can help with',
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 10),
          _ProfileActionTile(
            icon: Icons.videogame_asset_rounded,
            title: 'Daily streak challenges',
          ),
          const SizedBox(height: 8),
          _ProfileActionTile(
            icon: Icons.map_rounded,
            title: 'District explorer',
          ),
          const SizedBox(height: 24),
          FilledButton.icon(
            onPressed: _busy ? null : () => _guard(authService.signOut),
            style: FilledButton.styleFrom(
              minimumSize: const Size.fromHeight(50),
              textStyle: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w700,
              ),
            ),
            icon: const Icon(Icons.logout_rounded),
            label: const Text('Sign out'),
          ),
          if (_busy) ...<Widget>[
            const SizedBox(height: 16),
            const LinearProgressIndicator(),
          ],
          if (_error != null) ...<Widget>[
            const SizedBox(height: 12),
            Text(
              _error!,
              style: theme.textTheme.bodySmall?.copyWith(
                color: colorScheme.error,
              ),
            ),
          ],
        ],
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        Row(
          children: <Widget>[
            IconButton(
              icon: const Icon(Icons.arrow_back_ios_new_rounded),
              onPressed: () => Navigator.of(context).maybePop(),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                _showSignUp ? 'Sign up' : 'Sign in',
                style: theme.textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Text(
          'Choose a method to save your streaks and resume on any device.',
          style: theme.textTheme.bodyMedium?.copyWith(
            color: colorScheme.onSurfaceVariant,
            height: 1.35,
          ),
        ),
        const SizedBox(height: 20),
        FilledButton.icon(
          onPressed:
              _busy ? null : () => _startAuthFlow(authService.signInWithGoogle),
          style: FilledButton.styleFrom(
            minimumSize: const Size.fromHeight(48),
            backgroundColor: colorScheme.primary,
          ),
          icon: const Icon(Icons.g_mobiledata_rounded, size: 28),
          label: const Text('Continue with Google'),
        ),
        const SizedBox(height: 12),
        OutlinedButton.icon(
          onPressed:
              _busy ? null : () => _startAuthFlow(authService.signInWithGithub),
          style: OutlinedButton.styleFrom(
            minimumSize: const Size.fromHeight(48),
          ),
          icon: const Icon(Icons.code_rounded),
          label: const Text('Continue with GitHub'),
        ),
        const SizedBox(height: 20),
        Text(
          'OR',
          style: theme.textTheme.labelMedium?.copyWith(
            color: colorScheme.onSurfaceVariant,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _emailController,
          decoration: const InputDecoration(
            labelText: 'Email',
          ),
          keyboardType: TextInputType.emailAddress,
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _passwordController,
          decoration: const InputDecoration(
            labelText: 'Password',
          ),
          obscureText: true,
        ),
        const SizedBox(height: 12),
        if (!_showSignUp) ...<Widget>[
          const SizedBox(height: 12),
          FilledButton(
            onPressed: _busy
                ? null
                : () => _startAuthFlow(
                      () => authService.signInWithEmail(
                        email: _emailController.text.trim(),
                        password: _passwordController.text,
                      ),
                    ),
            style: FilledButton.styleFrom(
              minimumSize: const Size.fromHeight(46),
            ),
            child: const Text('Sign in'),
          ),
          TextButton(
            onPressed: _busy
                ? null
                : () => setState(() {
                      _showSignUp = true;
                      _error = null;
                    }),
            child: const Text('Create a new account'),
          ),
        ] else ...<Widget>[
          const SizedBox(height: 12),
          TextField(
            controller: _confirmPasswordController,
            decoration: const InputDecoration(
              labelText: 'Confirm password',
            ),
            obscureText: true,
          ),
          const SizedBox(height: 8),
          FilledButton(
            onPressed:
                _busy ? null : () => _startAuthFlow(() => _signUp(authService)),
            style: FilledButton.styleFrom(
              minimumSize: const Size.fromHeight(46),
            ),
            child: const Text('Create account'),
          ),
          TextButton(
            onPressed: _busy
                ? null
                : () => setState(() {
                      _showSignUp = false;
                      _error = null;
                    }),
            child: const Text('Back to sign in'),
          ),
        ],
        if (_busy) ...<Widget>[
          const SizedBox(height: 16),
          const LinearProgressIndicator(),
        ],
        if (_error != null) ...<Widget>[
          const SizedBox(height: 12),
          Text(
            _error!,
            style: theme.textTheme.bodySmall?.copyWith(
              color: colorScheme.error,
            ),
          ),
        ],
      ],
    );
  }
}
class _ProfileStatTile extends StatelessWidget {
  const _ProfileStatTile({
    required this.icon,
    required this.label,
    required this.value,
  });

  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;

    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Row(
            children: <Widget>[
              Icon(icon, size: 18, color: colorScheme.primary),
              const SizedBox(width: 6),
              Text(
                label,
                style: theme.textTheme.bodySmall?.copyWith(
                  color: colorScheme.onSurfaceVariant,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }
}

class _ProfileChip extends StatelessWidget {
  const _ProfileChip({required this.icon, required this.label, this.active = false});

  final IconData icon;
  final String label;
  final bool active;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return Chip(
      avatar: Icon(icon,
          size: 16, color: active ? scheme.onPrimary : scheme.primary),
      label: Text(label),
      labelStyle: Theme.of(context).textTheme.bodyMedium?.copyWith(
            color: active ? scheme.onPrimary : scheme.primary,
            fontWeight: active ? FontWeight.w700 : FontWeight.w500,
          ),
      backgroundColor:
          active ? scheme.primary : scheme.surfaceVariant.withValues(alpha: 0.4),
      side: BorderSide(
        color: active
            ? scheme.primary
            : scheme.primary.withValues(alpha: 0.4),
      ),
    );
  }
}

class _ProfileActionTile extends StatelessWidget {
  const _ProfileActionTile({required this.icon, required this.title});

  final IconData icon;
  final String title;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: colorScheme.surfaceVariant.withValues(alpha: 0.35),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: <Widget>[
          Row(
            children: <Widget>[
              Icon(icon, color: colorScheme.primary),
              const SizedBox(width: 12),
              Text(
                title,
                style: theme.textTheme.bodyMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const Icon(Icons.arrow_forward_ios_rounded, size: 16),
        ],
      ),
    );
  }
}
