import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../data/auth_service.dart';

final Provider<AuthService> authServiceProvider = Provider<AuthService>((Ref ref) {
  return AuthService();
});

final StreamProvider<User?> authStateProvider =
    StreamProvider<User?>((Ref ref) {
  final AuthService service = ref.watch(authServiceProvider);
  return service.authStateChanges();
});
