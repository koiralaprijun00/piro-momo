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
      // Use a slightly cleaner gradient or solid color if preferred
      body: Container(
        width: double.infinity,
        height: double.infinity,
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
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 400),
                child: Card(
                  elevation: 8,
                  shadowColor: Colors.black.withValues(alpha: 0.1),
                  color: colorScheme.surface,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(32),
                  ),
                  margin: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
                  child: Padding(
                    padding: const EdgeInsets.all(32),
                    child: userValue.when(
                      data: (User? user) => _buildBody(
                        context,
                        theme,
                        colorScheme,
                        authService,
                        user,
                      ),
                      error: (Object error, StackTrace stackTrace) => Center(
                        child: Text(
                          'Unable to load profile',
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: colorScheme.error,
                          ),
                        ),
                      ),
                      loading: () => const Center(
                        child: Padding(
                          padding: EdgeInsets.all(24.0),
                          child: CircularProgressIndicator(),
                        ),
                      ),
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
        if (!mounted) return;
        if (Navigator.of(context).canPop()) {
          Navigator.of(context).pop();
        }
      });
      _closeAfterAuth = false;
      return const SizedBox.shrink();
    }

    if (user != null) {
      return Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: <Widget>[
          // Header with Back Button and Title
          Row(
            children: <Widget>[
              IconButton.filledTonal(
                icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
                onPressed: () => Navigator.of(context).maybePop(),
              ),
              const Spacer(),
              Text(
                'Profile',
                style: theme.textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const Spacer(),
              // Logout Button
              IconButton(
                icon: Icon(Icons.logout_rounded, color: colorScheme.error),
                onPressed: _busy ? null : () => _guard(authService.signOut),
                tooltip: 'Sign out',
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Profile Avatar with decorative ring
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(
                color: colorScheme.primary.withValues(alpha: 0.2),
                width: 2,
              ),
            ),
            child: CircleAvatar(
              radius: 45,
              backgroundColor: colorScheme.primaryContainer,
              backgroundImage:
                  user.photoURL != null ? NetworkImage(user.photoURL!) : null,
              child: user.photoURL == null
                  ? Text(
                      (user.displayName ?? user.email ?? '?')
                          .substring(0, 1)
                          .toUpperCase(),
                      style: theme.textTheme.displaySmall?.copyWith(
                        color: colorScheme.onPrimaryContainer,
                        fontWeight: FontWeight.bold,
                      ),
                    )
                  : null,
            ),
          ),
          const SizedBox(height: 16),

          // Name and Email
          Text(
            user.displayName ?? 'Piromomo Player',
            textAlign: TextAlign.center,
            style: theme.textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            user.email ?? 'Email not provided',
            textAlign: TextAlign.center,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: colorScheme.onSurfaceVariant,
            ),
          ),
          const SizedBox(height: 24),

          // Stats Grid
          Row(
            children: <Widget>[
              Expanded(
                child: _ProfileStatTile(
                  icon: Icons.local_fire_department_rounded,
                  label: 'Streak',
                  value: '12 Days', // Placeholder for visual
                  color: Colors.orange,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _ProfileStatTile(
                  icon: Icons.military_tech_rounded,
                  label: 'High Score',
                  value: '2,450',
                  color: Colors.amber,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
           // Badge Row (Full Width)
          _ProfileStatTile(
            icon: Icons.workspace_premium_rounded,
            label: 'Badges Earned',
            value: '${user.providerData.length} Badges',
            color: Colors.purple,
            isFullWidth: true,
          ),

          const SizedBox(height: 24),

          // Bio Section
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: colorScheme.surfaceContainer,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Bio',
                  style: theme.textTheme.labelLarge?.copyWith(
                    color: colorScheme.primary,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'A curious lifelong learner. Loves conquering Nepali trivia while sipping coffee.',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: colorScheme.onSurfaceVariant,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),

          if (_busy) ...<Widget>[
            const SizedBox(height: 24),
            const LinearProgressIndicator(),
          ],
          if (_error != null) ...<Widget>[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: colorScheme.errorContainer,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                _error!,
                style: theme.textTheme.bodySmall?.copyWith(
                  color: colorScheme.onErrorContainer,
                ),
              ),
            ),
          ],
        ],
      );
    }

    // -----------------------
    // Auth Flow (Sign In / Up)
    // -----------------------
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        Row(
          children: [
            IconButton(
               icon: const Icon(Icons.arrow_back_ios_new_rounded),
               onPressed: () => Navigator.of(context).maybePop(),
            ),
            const SizedBox(width: 8),
            Text(
              _showSignUp ? 'Create Account' : 'Welcome Back',
              style: theme.textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.w800,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Text(
          'Save your progress and join the leaderboard.',
          style: theme.textTheme.bodyMedium?.copyWith(
            color: colorScheme.onSurfaceVariant,
          ),
        ),
        const SizedBox(height: 32),

        // Social Buttons
        FilledButton.icon(
          onPressed: _busy ? null : () => _startAuthFlow(authService.signInWithGoogle),
          style: FilledButton.styleFrom(
            minimumSize: const Size.fromHeight(56),
            backgroundColor: colorScheme.surfaceContainerHigh,
            foregroundColor: colorScheme.onSurface,
            elevation: 0,
          ),
          icon: const Icon(Icons.g_mobiledata_rounded, size: 28),
          label: const Text('Continue with Google'),
        ),
        const SizedBox(height: 24),
        Row(
          children: [
            Expanded(child: Divider(color: colorScheme.outlineVariant)),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text('OR', style: theme.textTheme.labelSmall),
            ),
            Expanded(child: Divider(color: colorScheme.outlineVariant)),
          ],
        ),
        const SizedBox(height: 24),

        // Email Input
        TextField(
          controller: _emailController,
          decoration: InputDecoration(
            labelText: 'Email Address',
            prefixIcon: const Icon(Icons.email_outlined),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: colorScheme.outlineVariant),
            ),
          ),
          keyboardType: TextInputType.emailAddress,
        ),
        const SizedBox(height: 16),
        
        // Password Input
        TextField(
          controller: _passwordController,
          decoration: InputDecoration(
            labelText: 'Password',
            prefixIcon: const Icon(Icons.lock_outline),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: colorScheme.outlineVariant),
            ),
          ),
          obscureText: true,
        ),

        // Confirm Password (Sign Up only)
        if (_showSignUp) ...[
          const SizedBox(height: 16),
          TextField(
            controller: _confirmPasswordController,
            decoration: InputDecoration(
              labelText: 'Confirm Password',
              prefixIcon: const Icon(Icons.lock_reset),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: colorScheme.outlineVariant),
              ),
            ),
            obscureText: true,
          ),
        ],

        const SizedBox(height: 24),

        // Action Button
        FilledButton(
          onPressed: _busy
              ? null
              : () => _showSignUp
                  ? _startAuthFlow(() => _signUp(authService))
                  : _startAuthFlow(() => authService.signInWithEmail(
                      email: _emailController.text.trim(),
                      password: _passwordController.text,
                    )),
          style: FilledButton.styleFrom(
            minimumSize: const Size.fromHeight(56),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          ),
          child: Text(
            _showSignUp ? 'Sign Up' : 'Sign In',
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
        ),

        const SizedBox(height: 16),

        // Toggle Mode
        Center(
          child: TextButton(
            onPressed: _busy
                ? null
                : () => setState(() {
                      _showSignUp = !_showSignUp;
                      _error = null;
                    }),
            child: Text.rich(
              TextSpan(
                text: _showSignUp
                    ? 'Already have an account? '
                    : 'Don\'t have an account? ',
                style: TextStyle(color: colorScheme.onSurfaceVariant),
                children: [
                  TextSpan(
                    text: _showSignUp ? 'Sign in' : 'Sign up',
                    style: TextStyle(
                      color: colorScheme.primary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),

        if (_busy) ...<Widget>[
          const SizedBox(height: 16),
          const LinearProgressIndicator(),
        ],
        if (_error != null) ...<Widget>[
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: colorScheme.errorContainer,
              borderRadius: BorderRadius.circular(12),
            ),
            width: double.infinity,
            child: Text(
              _error!,
              style: theme.textTheme.bodySmall?.copyWith(
                color: colorScheme.onErrorContainer,
              ),
              textAlign: TextAlign.center,
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
    required this.color,
    this.isFullWidth = false,
  });

  final IconData icon;
  final String label;
  final String value;
  final Color color;
  final bool isFullWidth;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;

    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
      decoration: BoxDecoration(
        color: colorScheme.surfaceContainerLow,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: colorScheme.outline.withValues(alpha: 0.1)),
      ),
      child: isFullWidth
          ? Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(icon, size: 20, color: color),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        label,
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: colorScheme.onSurfaceVariant,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      Text(
                        value,
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                )
              ],
            )
          : Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(icon, size: 24, color: color),
                ),
                const SizedBox(height: 12),
                Text(
                  value,
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                    height: 1,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  label,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: colorScheme.onSurfaceVariant,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
    );
  }
}