import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:google_sign_in/google_sign_in.dart';

import '../../../core/validation/input_validator.dart';

class AuthService {
  AuthService();

  final FirebaseAuth _auth = FirebaseAuth.instance;

  // Use platform default config so Android picks up the package/SHA-based client.
  final GoogleSignIn _googleSignIn = GoogleSignIn();

  Stream<User?> authStateChanges() => _auth.authStateChanges();

  Future<void> signOut() async {
    await _auth.signOut();
    if (!kIsWeb) {
      await _googleSignIn.signOut();
    }
  }

  Future<void> signInWithGoogle() async {
    if (kIsWeb) {
      final GoogleAuthProvider provider = GoogleAuthProvider()
        ..setCustomParameters(<String, String>{'prompt': 'select_account'});
      await _auth.signInWithPopup(provider);
      return;
    }
    final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
    if (googleUser == null) {
      throw FirebaseAuthException(
        code: 'aborted-by-user',
        message: 'Google sign-in was cancelled.',
      );
    }
    final GoogleSignInAuthentication googleAuth =
        await googleUser.authentication;
    final OAuthCredential credential = GoogleAuthProvider.credential(
      accessToken: googleAuth.accessToken,
      idToken: googleAuth.idToken,
    );
    await _auth.signInWithCredential(credential);
  }

  Future<void> signInWithGithub() async {
    final GithubAuthProvider provider = GithubAuthProvider();
    provider.addScope('read:user');
    provider.setCustomParameters(<String, String>{'allow_signup': 'true'});
    await _auth.signInWithProvider(provider);
  }

  /// Signs in a user with email and password.
  /// 
  /// Validates email and password format before making the Firebase call.
  /// 
  /// Throws [ArgumentError] with a user-friendly message if validation fails.
  /// Throws [FirebaseAuthException] if authentication fails.
  /// 
  /// Example:
  /// ```dart
  /// try {
  ///   await authService.signInWithEmail(
  ///     email: 'user@example.com',
  ///     password: 'MyPass123',
  ///   );
  /// } on ArgumentError catch (e) {
  ///   // Show validation error: e.message
  /// } on FirebaseAuthException catch (e) {
  ///   // Show auth error: e.message
  /// }
  /// ```
  Future<void> signInWithEmail({
    required String email,
    required String password,
  }) async {
    // Validate email format
    final emailError = InputValidator.validateEmail(email);
    if (emailError != null) {
      throw ArgumentError(emailError);
    }

    // Validate password
    final passwordError = InputValidator.validatePassword(password);
    if (passwordError != null) {
      throw ArgumentError(passwordError);
    }

    // Proceed with Firebase authentication
    await _auth.signInWithEmailAndPassword(
      email: email.trim(),
      password: password,
    );
  }

  /// Creates a new user account with email and password.
  /// 
  /// Validates email and password format before making the Firebase call.
  /// 
  /// Throws [ArgumentError] with a user-friendly message if validation fails.
  /// Throws [FirebaseAuthException] if account creation fails.
  /// 
  /// Example:
  /// ```dart
  /// try {
  ///   await authService.signUpWithEmail(
  ///     email: 'user@example.com',
  ///     password: 'MyPass123',
  ///   );
  /// } on ArgumentError catch (e) {
  ///   // Show validation error: e.message
  /// } on FirebaseAuthException catch (e) {
  ///   // Show auth error: e.message
  /// }
  /// ```
  Future<void> signUpWithEmail({
    required String email,
    required String password,
  }) async {
    // Validate email format
    final emailError = InputValidator.validateEmail(email);
    if (emailError != null) {
      throw ArgumentError(emailError);
    }

    // Validate password strength
    final passwordError = InputValidator.validatePassword(password);
    if (passwordError != null) {
      throw ArgumentError(passwordError);
    }

    // Proceed with Firebase account creation
    await _auth.createUserWithEmailAndPassword(
      email: email.trim(),
      password: password,
    );
  }
}
