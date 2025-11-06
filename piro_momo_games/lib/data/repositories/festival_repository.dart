import 'dart:convert';

import 'package:flutter/services.dart' show AssetBundle, rootBundle;

import '../models/festival_question.dart';
import '../models/game_locale.dart';

class FestivalRepository {
  FestivalRepository({AssetBundle? bundle}) : _bundle = bundle ?? rootBundle;

  final AssetBundle _bundle;
  final Map<GameLocale, List<FestivalQuestion>> _cache =
      <GameLocale, List<FestivalQuestion>>{};
  final Map<GameLocale, Future<List<FestivalQuestion>>> _inFlight =
      <GameLocale, Future<List<FestivalQuestion>>>{};

  static const Map<GameLocale, String> _assetPaths = <GameLocale, String>{
    GameLocale.english: 'assets/data/guess_festival_en.json',
    GameLocale.nepali: 'assets/data/guess_festival_np.json',
  };

  Future<List<FestivalQuestion>> loadQuestions(GameLocale locale) {
    if (_cache.containsKey(locale)) {
      return Future<List<FestivalQuestion>>.value(_cache[locale]!);
    }

    if (_inFlight.containsKey(locale)) {
      return _inFlight[locale]!;
    }

    final Future<List<FestivalQuestion>> loader = _loadFromAsset(locale);
    _inFlight[locale] = loader;

    return loader.then((List<FestivalQuestion> questions) {
      _cache[locale] = questions;
      _inFlight.remove(locale);
      return questions;
    });
  }

  FestivalQuestion? findById(String id, GameLocale locale) {
    final List<FestivalQuestion>? questions = _cache[locale];
    if (questions == null) {
      return null;
    }
    for (final FestivalQuestion question in questions) {
      if (question.id == id) {
        return question;
      }
    }
    return null;
  }

  Future<List<FestivalQuestion>> _loadFromAsset(GameLocale locale) async {
    final String? assetPath = _assetPaths[locale];
    if (assetPath == null) {
      throw ArgumentError('Unsupported locale: $locale');
    }

    final String raw = await _bundle.loadString(assetPath);
    final List<dynamic> decoded = json.decode(raw) as List<dynamic>;

    return decoded
        .cast<Map<String, dynamic>>()
        .map(
          (Map<String, dynamic> json) =>
              FestivalQuestion.fromJson(json, locale),
        )
        .toList(growable: false);
  }
}
