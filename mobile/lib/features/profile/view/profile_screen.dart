import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../auth/data/auth_service.dart';
import '../../auth/providers/auth_providers.dart';
import '../../../data/providers.dart';
import '../../../core/persistence/progress_store.dart';
import '../../../core/validation/input_validator.dart';

class ProfileStats {
  const ProfileStats({
    required this.bestStreak,
    required this.bestScore,
    required this.gamesTracked,
  });

  final int bestStreak;
  final int bestScore;
  final int gamesTracked;
}

final FutureProvider<ProfileStats> profileStatsProvider =
    FutureProvider<ProfileStats>((Ref ref) async {
      final ProgressStore store = ref.watch(progressStoreProvider);
      final int bestStreak = await store.loadBestStreakAcrossGames();
      final int bestScore = await store.loadBestScoreAcrossGames();
      final List<int> bests = <int>[
        await store.loadFestivalBestScore(),
        await store.loadRiddleBestScore(),
        await store.loadGkBestScore(),
        await store.loadKingsBestScore(),
        await store.loadDistrictBestScore(),
      ];
      final int gamesTracked = bests.where((int v) => v > 0).length;
      return ProfileStats(
        bestStreak: bestStreak,
        bestScore: bestScore,
        gamesTracked: gamesTracked,
      );
    });

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
    } on ArgumentError catch (error) {
      // Handle validation errors with user-friendly messages
      setState(() {
        _error = error.message;
      });
    } on FirebaseAuthException catch (error) {
      // Handle Firebase auth errors with user-friendly messages
      String errorMessage = error.message ?? error.code;
      
      // Map Firebase error codes to user-friendly messages
      switch (error.code) {
        case 'user-not-found':
          errorMessage = 'No account found with this email address.';
          break;
        case 'wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'email-already-in-use':
          errorMessage = 'An account already exists with this email address.';
          break;
        case 'weak-password':
          errorMessage = 'Password is too weak. Please use a stronger password.';
          break;
        case 'invalid-email':
          errorMessage = 'Invalid email address. Please check and try again.';
          break;
        case 'user-disabled':
          errorMessage = 'This account has been disabled. Please contact support.';
          break;
        case 'too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        case 'operation-not-allowed':
          errorMessage = 'This sign-in method is not enabled.';
          break;
        default:
          // Keep the original message if we don't have a specific mapping
          break;
      }
      
      setState(() {
        _error = errorMessage;
      });
    } on PlatformException catch (error) {
      // Handle platform-specific errors (like Google Sign-In)
      String errorMessage = 'Sign-in failed. Please try again.';
      
      if (error.code == 'sign_in_failed' || error.code == 'sign_in_canceled') {
        if (error.message?.contains('ApiException: 10') == true) {
          errorMessage = 'Google Sign-In configuration error. Please contact support.';
        } else if (error.message?.contains('ApiException: 12500') == true) {
          errorMessage = 'Google Sign-In was canceled.';
        } else if (error.message?.contains('sign_in_failed') == true) {
          errorMessage = 'Google Sign-In failed. Please try again.';
        }
      }
      
      setState(() {
        _error = errorMessage;
      });
    } catch (error) {
      // Handle any other errors with a user-friendly message
      String errorMessage = 'An error occurred. Please try again.';
      
      // If it's a string error, try to extract a readable message
      final errorString = error.toString();
      if (errorString.contains('PlatformException')) {
        errorMessage = 'Sign-in failed. Please try again.';
      } else if (errorString.length < 100) {
        // Only show short error messages directly
        errorMessage = errorString;
      }
      
      setState(() {
        _error = errorMessage;
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
    final String email = _emailController.text.trim();
    final String password = _passwordController.text;
    final String confirm = _confirmPasswordController.text;

    // Validate email format
    final emailError = InputValidator.validateEmail(email);
    if (emailError != null) {
      setState(() => _error = emailError);
      return;
    }

    // Validate password strength
    final passwordError = InputValidator.validatePassword(password);
    if (passwordError != null) {
      setState(() => _error = passwordError);
      return;
    }

    // Validate password match
    final matchError = InputValidator.validatePasswordMatch(password, confirm);
    if (matchError != null) {
      setState(() => _error = matchError);
      return;
    }

    // All validation passed, proceed with sign up
    await service.signUpWithEmail(
      email: email,
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
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFF6366F1), // Indigo
              Color(0xFFA855F7), // Purple
              Color(0xFFEC4899), // Pink
            ],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 460),
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(
                      color: Colors.white.withValues(alpha: 0.2),
                      width: 1.5,
                    ),
                    boxShadow: <BoxShadow>[
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.1),
                        blurRadius: 20,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
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
      final AsyncValue<ProfileStats> statsValue =
          ref.watch(profileStatsProvider);

      return Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: <Widget>[
          Row(
            children: <Widget>[
              IconButton(
                icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
                color: Colors.white,
                onPressed: () => Navigator.of(context).maybePop(),
              ),
              const Spacer(),
              const Spacer(),
              TextButton.icon(
                style: TextButton.styleFrom(
                  foregroundColor: Colors.white,
                  backgroundColor: Colors.white.withValues(alpha: 0.1),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  disabledForegroundColor: Colors.white.withValues(alpha: 0.5),
                ),
                icon: _busy
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : const Icon(Icons.logout_rounded, size: 18),
                onPressed: _busy ? null : () => _guard(authService.signOut),
                label: Text(_busy ? 'Signing out...' : 'Sign out'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _FrostedCard(
            child: Column(
              children: <Widget>[
                CircleAvatar(
                  radius: 44,
                  backgroundColor: Colors.white.withValues(alpha: 0.08),
                  backgroundImage:
                      user.photoURL != null ? NetworkImage(user.photoURL!) : null,
                  child: user.photoURL == null
                      ? Text(
                          (user.displayName ?? user.email ?? '?')
                              .substring(0, 1)
                              .toUpperCase(),
                          style: theme.textTheme.headlineMedium?.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.w800,
                          ),
                        )
                      : null,
                ),
                const SizedBox(height: 10),
                Text(
                  user.displayName ?? 'Piromomo Player',
                  style: theme.textTheme.headlineSmall?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w800,
                    letterSpacing: -0.2,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  user.email ?? 'Email not provided',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: Colors.white.withValues(alpha: 0.7),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          statsValue.when(
            data: (ProfileStats stats) => Column(
              children: <Widget>[
                Row(
                  children: <Widget>[
                    Expanded(
                      child: _ProfileStatTile(
                        icon: Icons.local_fire_department_rounded,
                        label: 'Best Streak',
                        value: '${stats.bestStreak}',
                        color: Colors.orangeAccent,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _ProfileStatTile(
                        icon: Icons.military_tech_rounded,
                        label: 'High Score',
                        value: _formatNumber(stats.bestScore),
                        color: Colors.amber.shade200,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                _ProfileStatTile(
                  icon: Icons.sports_esports_rounded,
                  label: 'Games Tracked',
                  value: '${stats.gamesTracked}',
                  color: Colors.lightBlueAccent,
                  isFullWidth: true,
                ),
              ],
            ),
            loading: () => const Padding(
              padding: EdgeInsets.symmetric(vertical: 16),
              child: LinearProgressIndicator(),
            ),
            error: (_, __) => const SizedBox.shrink(),
          ),
          if (_busy) ...<Widget>[
            const SizedBox(height: 20),
            const LinearProgressIndicator(),
          ],
          if (_error != null) ...<Widget>[
            const SizedBox(height: 14),
            _ErrorBanner(message: _error!),
          ],
        ],
      );
    }

    // Auth flow
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: <Widget>[
            IconButton(
              icon: const Icon(Icons.arrow_back_ios_new_rounded),
              color: Colors.white,
              onPressed: () => Navigator.of(context).maybePop(),
            ),
            SegmentedButton<bool>(
              style: ButtonStyle(
                visualDensity: VisualDensity.compact,
                padding: WidgetStateProperty.all(
                  const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                ),
                backgroundColor: WidgetStateProperty.resolveWith((states) {
                  if (states.contains(WidgetState.selected)) {
                    return Colors.white.withValues(alpha: 0.14);
                  }
                  return Colors.white.withValues(alpha: 0.06);
                }),
                foregroundColor: WidgetStateProperty.all<Color>(Colors.white),
              ),
              segments: const <ButtonSegment<bool>>[
                ButtonSegment<bool>(value: false, label: Text('Sign In')),
                ButtonSegment<bool>(value: true, label: Text('Sign Up')),
              ],
              selected: <bool>{_showSignUp},
              onSelectionChanged: (Set<bool> value) {
                setState(() {
                  _showSignUp = value.first;
                  _error = null;
                });
              },
            ),
          ],
        ),
        const SizedBox(height: 20),
        Text(
          _showSignUp ? 'Create your account' : 'Welcome back',
          style: theme.textTheme.headlineSmall?.copyWith(
            color: Colors.white,
            fontWeight: FontWeight.w800,
            letterSpacing: -0.2,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          'Sign in to sync your progress across devices.',
          style: theme.textTheme.bodyMedium?.copyWith(
            color: Colors.white.withValues(alpha: 0.7),
          ),
        ),
        const SizedBox(height: 18),
        if (_error != null) ...<Widget>[
          _ErrorBanner(message: _error!),
          const SizedBox(height: 12),
        ],
        if (_busy) ...<Widget>[
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                const SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                  ),
                ),
                const SizedBox(width: 12),
                Text(
                  'Please wait...',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
        ],
        _FrostedCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              FilledButton.icon(
                style: FilledButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: const Color(0xFF1F2937),
                  minimumSize: const Size(double.infinity, 54),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  elevation: 0,
                  disabledBackgroundColor: Colors.white.withValues(alpha: 0.5),
                ),
                icon: _busy
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF1F2937)),
                        ),
                      )
                    : const Icon(Icons.login),
                label: Text(
                  _busy ? 'Signing in...' : 'Continue with Google',
                  style: const TextStyle(fontWeight: FontWeight.w600),
                ),
                onPressed:
                    _busy ? null : () => _startAuthFlow(authService.signInWithGoogle),
              ),
              const SizedBox(height: 16),
              Row(
                children: <Widget>[
                  Expanded(child: Divider(color: Colors.white.withValues(alpha: 0.2))),
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 12),
                    child: Text('or',
                        style: TextStyle(color: Colors.white70)),
                  ),
                  Expanded(child: Divider(color: Colors.white.withValues(alpha: 0.2))),
                ],
              ),
              const SizedBox(height: 16),
              _AuthField(
                controller: _emailController,
                label: 'Email',
                icon: Icons.mail_outline_rounded,
                keyboardType: TextInputType.emailAddress,
                enabled: !_busy,
              ),
              const SizedBox(height: 12),
              _AuthField(
                controller: _passwordController,
                label: 'Password',
                icon: Icons.lock_outline_rounded,
                obscureText: true,
                enabled: !_busy,
              ),
              if (_showSignUp) ...<Widget>[
                const SizedBox(height: 12),
                _AuthField(
                  controller: _confirmPasswordController,
                  label: 'Confirm Password',
                  icon: Icons.lock_reset_rounded,
                  obscureText: true,
                  enabled: !_busy,
                ),
              ],
              const SizedBox(height: 14),
              FilledButton(
                onPressed: _busy
                    ? null
                    : () {
                        if (_showSignUp) {
                          _guard(() => _signUp(authService));
                        } else {
                          _guard(() async {
                            await authService.signInWithEmail(
                              email: _emailController.text.trim(),
                              password: _passwordController.text,
                            );
                          });
                        }
                      },
                style: FilledButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: const Color(0xFF1F2937),
                  minimumSize: const Size(double.infinity, 54),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  elevation: 0,
                  disabledBackgroundColor: Colors.white.withValues(alpha: 0.5),
                ),
                child: _busy
                    ? Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: <Widget>[
                          const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF1F2937)),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Text(
                            _showSignUp ? 'Creating account...' : 'Signing in...',
                            style: const TextStyle(fontWeight: FontWeight.w600),
                          ),
                        ],
                      )
                    : Text(
                        _showSignUp ? 'Create Account' : 'Sign In',
                        style: const TextStyle(fontWeight: FontWeight.w600),
                      ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _FrostedCard extends StatelessWidget {
  const _FrostedCard({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.25),
          width: 1.5,
        ),
      ),
      child: child,
    );
  }
}

class _AuthField extends StatelessWidget {
  const _AuthField({
    required this.controller,
    required this.label,
    required this.icon,
    this.keyboardType,
    this.obscureText = false,
    this.enabled = true,
  });

  final TextEditingController controller;
  final String label;
  final IconData icon;
  final TextInputType? keyboardType;
  final bool obscureText;
  final bool enabled;

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      enabled: enabled,
      keyboardType: keyboardType,
      obscureText: obscureText,
      style: const TextStyle(color: Colors.white),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: TextStyle(color: Colors.white.withValues(alpha: 0.8)),
        prefixIcon: Icon(icon, color: Colors.white.withValues(alpha: 0.8)),
        filled: true,
        fillColor: Colors.white.withValues(alpha: 0.12),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(
            color: Colors.white.withValues(alpha: 0.25),
            width: 1.5,
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(
            color: Colors.white,
            width: 2,
          ),
        ),
      ),
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

    return Container(
      padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 18),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.25),
          width: 1.5,
        ),
      ),
      child: isFullWidth
          ? Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.35),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(icon, size: 20, color: Colors.white),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        label,
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: Colors.white70,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      Text(
                        value,
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
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
                    color: color.withValues(alpha: 0.35),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(icon, size: 24, color: Colors.white),
                ),
                const SizedBox(height: 12),
                Text(
                  value,
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                    height: 1,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  label,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: Colors.white70,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
    );
  }
}


class _ErrorBanner extends StatelessWidget {
  const _ErrorBanner({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.red.shade900.withValues(alpha: 0.9),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.red.shade700, width: 1),
      ),
      child: Row(
        children: <Widget>[
          const Icon(Icons.error_outline, color: Colors.white, size: 20),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              message,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

String _formatNumber(int value) {
  final String digits = value.toString();
  final StringBuffer reversed = StringBuffer();
  int count = 0;
  for (int i = digits.length - 1; i >= 0; i--) {
    reversed.write(digits[i]);
    count++;
    if (count % 3 == 0 && i != 0) {
      reversed.write(',');
    }
  }
  return reversed.toString().split('').reversed.join();
}
