import 'dart:convert';

import 'package:flutter/services.dart' show AssetBundle, rootBundle;

import '../models/game_locale.dart';
import '../models/riddle_entry.dart';

class RiddleRepository {
  RiddleRepository({AssetBundle? bundle}) : _bundle = bundle ?? rootBundle;

  final AssetBundle _bundle;
  final Map<GameLocale, List<RiddleEntry>> _cache =
      <GameLocale, List<RiddleEntry>>{};
  final Map<GameLocale, Future<List<RiddleEntry>>> _inFlight =
      <GameLocale, Future<List<RiddleEntry>>>{};

  static const Map<GameLocale, String> _assetPaths = <GameLocale, String>{
    GameLocale.english: 'assets/data/gau_khane_katha_en.json',
    GameLocale.nepali: 'assets/data/gau_khane_katha_np.json',
  };

  Future<List<RiddleEntry>> loadRiddles(GameLocale locale) {
    if (_cache.containsKey(locale)) {
      return Future<List<RiddleEntry>>.value(_cache[locale]!);
    }

    if (_inFlight.containsKey(locale)) {
      return _inFlight[locale]!;
    }

    final Future<List<RiddleEntry>> loader = _loadFromAsset(locale);
    _inFlight[locale] = loader;
    return loader.then((List<RiddleEntry> riddles) {
      _cache[locale] = riddles;
      _inFlight.remove(locale);
      return riddles;
    });
  }

  RiddleEntry? findById(String id, GameLocale locale) {
    final List<RiddleEntry>? riddles = _cache[locale];
    if (riddles == null) {
      return null;
    }
    for (final RiddleEntry entry in riddles) {
      if (entry.id == id) {
        return entry;
      }
    }
    return null;
  }

  Future<List<RiddleEntry>> _loadFromAsset(GameLocale locale) async {
    final String? assetPath = _assetPaths[locale];
    if (assetPath == null) {
      throw ArgumentError('Unsupported locale: $locale');
    }

    final String raw = await _bundle.loadString(assetPath);
    final List<dynamic> decoded = json.decode(raw) as List<dynamic>;

    return decoded
        .cast<Map<String, dynamic>>()
        .map((Map<String, dynamic> json) => RiddleEntry.fromJson(json, locale))
        .toList(growable: false);
  }
}
