import 'package:flutter/foundation.dart';

/// Game events (answers, rounds). Nothing is sent anywhere: events are only
/// printed in debug builds, so release builds collect no analytics data.
class AnalyticsService {
  const AnalyticsService();

  Future<void> logEvent(
    String name, {
    Map<String, Object?> parameters = const <String, Object?>{},
  }) async {
    if (kDebugMode) {
      debugPrint('analytics: $name -> $parameters');
    }
  }
}
