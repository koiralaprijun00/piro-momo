import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart' show defaultTargetPlatform, kIsWeb, TargetPlatform;

/// Replace the placeholder values below with the Firebase configuration for
/// each platform. Generate real values via `flutterfire configure`.
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return _web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return _android;
      case TargetPlatform.iOS:
        return _ios;
      case TargetPlatform.macOS:
        return _macos;
      default:
        throw UnsupportedError('Unsupported platform for Firebase.');
    }
  }

  static const FirebaseOptions _web = FirebaseOptions(
    apiKey: 'WEB_API_KEY',
    appId: 'WEB_APP_ID',
    messagingSenderId: 'WEB_MESSAGING_SENDER_ID',
    projectId: 'WEB_PROJECT_ID',
    authDomain: 'WEB_AUTH_DOMAIN',
    storageBucket: 'WEB_STORAGE_BUCKET',
  );

  static const FirebaseOptions _android = FirebaseOptions(
    apiKey: 'ANDROID_API_KEY',
    appId: 'ANDROID_APP_ID',
    messagingSenderId: 'ANDROID_MESSAGING_SENDER_ID',
    projectId: 'ANDROID_PROJECT_ID',
    storageBucket: 'ANDROID_STORAGE_BUCKET',
  );

  static const FirebaseOptions _ios = FirebaseOptions(
    apiKey: 'IOS_API_KEY',
    appId: 'IOS_APP_ID',
    messagingSenderId: 'IOS_MESSAGING_SENDER_ID',
    projectId: 'IOS_PROJECT_ID',
    storageBucket: 'IOS_STORAGE_BUCKET',
    iosClientId: 'IOS_CLIENT_ID',
    iosBundleId: 'com.piromomo.games',
  );

  static const FirebaseOptions _macos = FirebaseOptions(
    apiKey: 'MACOS_API_KEY',
    appId: 'MACOS_APP_ID',
    messagingSenderId: 'MACOS_MESSAGING_SENDER_ID',
    projectId: 'MACOS_PROJECT_ID',
    storageBucket: 'MACOS_STORAGE_BUCKET',
    iosClientId: 'MACOS_CLIENT_ID',
    iosBundleId: 'com.piromomo.games',
  );
}
