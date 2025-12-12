/// Exception thrown when asset loading fails.
class AssetLoadException implements Exception {
  AssetLoadException(this.message, {this.originalError, this.stackTrace});

  final String message;
  final Object? originalError;
  final StackTrace? stackTrace;

  @override
  String toString() => 'AssetLoadException: $message';
}

/// Exception thrown when JSON parsing fails.
class DataParseException implements Exception {
  DataParseException(this.message, {this.originalError});

  final String message;
  final Object? originalError;

  @override
  String toString() => 'DataParseException: $message';
}
