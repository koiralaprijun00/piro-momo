import 'dart:convert';

import 'package:flutter/services.dart' show AssetBundle, rootBundle;

import '../exceptions.dart';
import '../models/temple_entry.dart';

class TempleRepository {
  TempleRepository({AssetBundle? bundle}) : _bundle = bundle ?? rootBundle;

  final AssetBundle _bundle;
  List<TempleEntry>? _cache;
  Future<List<TempleEntry>>? _inFlight;

  static const String _assetPath = 'assets/data/guess_temple_en.json';

  Future<List<TempleEntry>> loadTemples() {
    if (_cache != null) {
      return Future<List<TempleEntry>>.value(_cache!);
    }
    if (_inFlight != null) {
      return _inFlight!;
    }

    final Future<List<TempleEntry>> loader = _loadFromAsset();
    _inFlight = loader;

    return loader.then((List<TempleEntry> entries) {
      _cache = entries;
      _inFlight = null;
      return entries;
    });
  }

  Future<List<TempleEntry>> _loadFromAsset() async {
    try {
      final String raw = await _bundle.loadString(_assetPath);
      final List<dynamic> decoded = json.decode(raw) as List<dynamic>;
      return decoded
          .cast<Map<String, dynamic>>()
          .map(TempleEntry.fromJson)
          .toList(growable: false);
    } on FormatException catch (e) {
      throw DataParseException(
        'Failed to parse JSON from: $_assetPath',
        originalError: e,
      );
    } catch (e, stackTrace) {
      throw AssetLoadException(
        'Failed to load asset: $_assetPath',
        originalError: e,
        stackTrace: stackTrace,
      );
    }
  }
}
