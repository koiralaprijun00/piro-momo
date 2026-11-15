import 'package:cloud_firestore/cloud_firestore.dart';
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

  /// Same rule as the web app: only users with a verified email count as signed in
  /// for account features (profile, cloud sync).
  static bool isVerified(User? user) => user != null && user.emailVerified;

  /// Sends (or re-sends) the verification email to the signed-in user.
  Future<void> sendEmailVerification() async {
    final User? user = _auth.currentUser;
    if (user != null && !user.emailVerified) {
      await user.sendEmailVerification();
    }
  }

  /// Refreshes the user from Firebase and reports whether the email is now verified.
  Future<bool> reloadAndCheckVerified() async {
    final User? user = _auth.currentUser;
    if (user == null) return false;
    await user.reload();
    return _auth.currentUser?.emailVerified ?? false;
  }

  /// True when the account signs in with an email and password (not only Google).
  static bool usesPassword(User? user) =>
      user?.providerData.any((UserInfo info) => info.providerId == 'password') ?? false;

  /// Permanently deletes the signed-in account and the progress saved for it in
  /// the cloud (this app's `users/{uid}` data and the website's `user_stats/{uid}`).
  /// Google Play requires apps that let people sign up to offer this in the app.
  ///
  /// Firebase only deletes accounts that signed in recently, so this signs in
  /// again first: with [password] for email accounts, or with Google.
  /// Throws [FirebaseAuthException] (e.g. `wrong-password`, `requires-recent-login`).
  Future<void> deleteAccount({String? password}) async {
    final User? user = _auth.currentUser;
    if (user == null) return;

    await _reauthenticate(user, password: password);

    final FirebaseFirestore db = FirebaseFirestore.instance;
    final DocumentReference<Map<String, dynamic>> userDoc =
        db.collection('users').doc(user.uid);
    final QuerySnapshot<Map<String, dynamic>> progress =
        await userDoc.collection('progress').get();
    final WriteBatch batch = db.batch();
    for (final QueryDocumentSnapshot<Map<String, dynamic>> doc in progress.docs) {
      batch.delete(doc.reference);
    }
    batch.delete(userDoc);
    await batch.commit();

    // Stats saved by the website, if this account also played there.
    final DocumentReference<Map<String, dynamic>> webStats =
        db.collection('user_stats').doc(user.uid);
    if ((await webStats.get()).exists) {
      await webStats.delete();
    }

    await user.delete();
    if (!kIsWeb) {
      await _googleSignIn.signOut();
    }
  }

  Future<void> _reauthenticate(User user, {String? password}) async {
    if (usesPassword(user)) {
      final String? email = user.email;
      if (email == null || password == null || password.isEmpty) {
        throw ArgumentError('Enter your password to delete your account.');
      }
      await user.reauthenticateWithCredential(
        EmailAuthProvider.credential(email: email, password: password),
      );
      return;
    }
    final bool usesGoogle = user.providerData
        .any((UserInfo info) => info.providerId == 'google.com');
    if (usesGoogle && !kIsWeb) {
      final GoogleSignInAccount? account =
          await _googleSignIn.signInSilently() ?? await _googleSignIn.signIn();
      if (account == null) {
        throw ArgumentError('Account deletion was cancelled.');
      }
      final GoogleSignInAuthentication googleAuth = await account.authentication;
      await user.reauthenticateWithCredential(
        GoogleAuthProvider.credential(
          accessToken: googleAuth.accessToken,
          idToken: googleAuth.idToken,
        ),
      );
    }
  }

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

    // Proceed with Firebase account creation, then send the verification email
    final UserCredential credential = await _auth.createUserWithEmailAndPassword(
      email: email.trim(),
      password: password,
    );
    await credential.user?.sendEmailVerification();
  }
}
