import 'dart:convert';

import 'package:flutter/services.dart' show AssetBundle, rootBundle;

import '../exceptions.dart';
import '../models/king_entry.dart';

class KingsRepository {
  KingsRepository({AssetBundle? bundle}) : _bundle = bundle ?? rootBundle;

  final AssetBundle _bundle;
  List<KingEntry>? _cache;
  Future<List<KingEntry>>? _inFlight;

  static const String _assetPath = 'assets/data/kings_of_nepal_en.json';

  Future<List<KingEntry>> loadKings() {
    if (_cache != null) {
      return Future<List<KingEntry>>.value(_cache!);
    }

    if (_inFlight != null) {
      return _inFlight!;
    }

    final Future<List<KingEntry>> loader = _loadFromAsset();
    _inFlight = loader;

    return loader.then((List<KingEntry> entries) {
      _cache = entries;
      _inFlight = null;
      return entries;
    });
  }

  Future<List<KingEntry>> _loadFromAsset() async {
    try {
      final String raw = await _bundle.loadString(_assetPath);
      final List<dynamic> decoded = json.decode(raw) as List<dynamic>;

      return decoded
          .cast<Map<String, dynamic>>()
          .map((Map<String, dynamic> json) => KingEntry.fromJson(json))
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
