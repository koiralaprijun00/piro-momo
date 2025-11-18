import 'dart:convert';

import 'package:flutter/services.dart' show AssetBundle, rootBundle;

import '../models/game_locale.dart';
import '../models/king_entry.dart';

class KingsRepository {
  KingsRepository({AssetBundle? bundle}) : _bundle = bundle ?? rootBundle;

  final AssetBundle _bundle;
  final Map<GameLocale, List<KingEntry>> _cache =
      <GameLocale, List<KingEntry>>{};
  final Map<GameLocale, Future<List<KingEntry>>> _inFlight =
      <GameLocale, Future<List<KingEntry>>>{};

  static const Map<GameLocale, String> _assetPaths = <GameLocale, String>{
    GameLocale.english: 'assets/data/kings_of_nepal_en.json',
    GameLocale.nepali: 'assets/data/kings_of_nepal_np.json',
  };

  Future<List<KingEntry>> loadKings(GameLocale locale) {
    if (_cache.containsKey(locale)) {
      return Future<List<KingEntry>>.value(_cache[locale]!);
    }

    if (_inFlight.containsKey(locale)) {
      return _inFlight[locale]!;
    }

    final Future<List<KingEntry>> loader = _loadFromAsset(locale);
    _inFlight[locale] = loader;

    return loader.then((List<KingEntry> entries) {
      _cache[locale] = entries;
      _inFlight.remove(locale);
      return entries;
    });
  }

  Future<List<KingEntry>> _loadFromAsset(GameLocale locale) async {
    final String? assetPath = _assetPaths[locale];
    if (assetPath == null) {
      throw ArgumentError('Unsupported locale: $locale');
    }

    final String raw = await _bundle.loadString(assetPath);
    final List<dynamic> decoded = json.decode(raw) as List<dynamic>;

    return decoded
        .cast<Map<String, dynamic>>()
        .map((Map<String, dynamic> json) => KingEntry.fromJson(json, locale))
        .toList(growable: false);
  }
}
