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
  bool _busy = false;
  String? _error;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
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
    if (user != null) {
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
                  'Your Account',
                  style: theme.textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            user.email ?? user.displayName ?? 'Anonymous user',
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.w700,
              color: colorScheme.primary,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Signed in via ${user.providerData.map((UserInfo info) => info.providerId).join(', ')}',
            style: theme.textTheme.bodySmall?.copyWith(
              color: colorScheme.onSurfaceVariant,
            ),
          ),
          const SizedBox(height: 24),
          FilledButton.icon(
            onPressed: _busy ? null : () => _guard(authService.signOut),
            style: FilledButton.styleFrom(
              minimumSize: const Size.fromHeight(48),
            ),
            icon: const Icon(Icons.logout_rounded),
            label: const Text('Sign out'),
          ),
          const SizedBox(height: 12),
          OutlinedButton.icon(
            onPressed: () => Navigator.of(context).maybePop(),
            icon: const Icon(Icons.close_rounded),
            label: const Text('Close'),
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
                'Sign in',
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
              _busy ? null : () => _guard(authService.signInWithGoogle),
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
              _busy ? null : () => _guard(authService.signInWithGithub),
          style: OutlinedButton.styleFrom(
            minimumSize: const Size.fromHeight(48),
          ),
          icon: const Icon(Icons.code_rounded),
          label: const Text('Continue with GitHub'),
        ),
        const SizedBox(height: 20),
        Text(
          'Or use email and password',
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
        FilledButton(
          onPressed: _busy
              ? null
              : () => _guard(() => authService.signInWithEmail(
                    email: _emailController.text.trim(),
                    password: _passwordController.text,
                  )),
          style: FilledButton.styleFrom(
            minimumSize: const Size.fromHeight(46),
          ),
          child: const Text('Sign in'),
        ),
        const SizedBox(height: 8),
        TextButton(
          onPressed: _busy
              ? null
              : () => _guard(() => authService.signUpWithEmail(
                    email: _emailController.text.trim(),
                    password: _passwordController.text,
                  )),
          child: const Text('Create a new account'),
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
}
