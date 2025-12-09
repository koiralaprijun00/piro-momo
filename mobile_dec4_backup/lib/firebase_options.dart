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
    apiKey: 'AIzaSyDHZK-ye_NYJx3nY4fJUmeQ5VlF3uTsXlU',
    appId: '1:693851674416:web:e6581a96074a83ca64daf5',
    messagingSenderId: '693851674416',
    projectId: 'piromomo-app',
    authDomain: 'piromomo-app.firebaseapp.com',
    storageBucket: 'piromomo-app.firebasestorage.app',
    measurementId: 'G-028E74WPHX',
  );

  static const FirebaseOptions _android = FirebaseOptions(
    apiKey: 'AIzaSyDHZK-ye_NYJx3nY4fJUmeQ5VlF3uTsXlU',
    appId: '1:693851674416:android:placeholder',
    messagingSenderId: '693851674416',
    projectId: 'piromomo-app',
    storageBucket: 'piromomo-app.firebasestorage.app',
  );

  static const FirebaseOptions _ios = FirebaseOptions(
    apiKey: 'AIzaSyDHZK-ye_NYJx3nY4fJUmeQ5VlF3uTsXlU',
    appId: '1:693851674416:ios:placeholder',
    messagingSenderId: '693851674416',
    projectId: 'piromomo-app',
    storageBucket: 'piromomo-app.firebasestorage.app',
    iosClientId: 'placeholder-ios-client-id',
    iosBundleId: 'com.piromomo.games',
  );

  static const FirebaseOptions _macos = FirebaseOptions(
    apiKey: 'AIzaSyDHZK-ye_NYJx3nY4fJUmeQ5VlF3uTsXlU',
    appId: '1:693851674416:ios:placeholder',
    messagingSenderId: '693851674416',
    projectId: 'piromomo-app',
    storageBucket: 'piromomo-app.firebasestorage.app',
    iosClientId: 'placeholder-ios-client-id',
    iosBundleId: 'com.piromomo.games',
  );
}
