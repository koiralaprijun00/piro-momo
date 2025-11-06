class AnalyticsService {
  const AnalyticsService();

  Future<void> logEvent(
    String name, {
    Map<String, Object?> parameters = const <String, Object?>{},
  }) async {
    // Placeholder hook: replace with Firebase Analytics or preferred provider.
    // ignore: avoid_print
    print('analytics: $name -> $parameters');
  }
}
