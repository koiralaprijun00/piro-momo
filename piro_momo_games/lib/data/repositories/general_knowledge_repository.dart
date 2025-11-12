import 'dart:convert';

import 'package:flutter/services.dart' show AssetBundle, rootBundle;

import '../models/general_knowledge_question.dart';
import '../models/game_locale.dart';

class GeneralKnowledgeRepository {
  GeneralKnowledgeRepository({AssetBundle? bundle})
    : _bundle = bundle ?? rootBundle;

  final AssetBundle _bundle;
  final Map<GameLocale, List<GeneralKnowledgeQuestion>> _cache =
      <GameLocale, List<GeneralKnowledgeQuestion>>{};
  final Map<GameLocale, Future<List<GeneralKnowledgeQuestion>>> _inFlight =
      <GameLocale, Future<List<GeneralKnowledgeQuestion>>>{};

  static const Map<GameLocale, String> _assetPaths = <GameLocale, String>{
    GameLocale.english: 'assets/data/general_knowledge_en.json',
    GameLocale.nepali: 'assets/data/general_knowledge_np.json',
  };

  Future<List<GeneralKnowledgeQuestion>> loadQuestions(GameLocale locale) {
    if (_cache.containsKey(locale)) {
      return Future<List<GeneralKnowledgeQuestion>>.value(_cache[locale]!);
    }

    if (_inFlight.containsKey(locale)) {
      return _inFlight[locale]!;
    }

    final Future<List<GeneralKnowledgeQuestion>> loader = _loadFromAsset(
      locale,
    );
    _inFlight[locale] = loader;

    return loader.then((List<GeneralKnowledgeQuestion> questions) {
      _cache[locale] = questions;
      _inFlight.remove(locale);
      return questions;
    });
  }

  Future<List<GeneralKnowledgeQuestion>> _loadFromAsset(
    GameLocale locale,
  ) async {
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
              GeneralKnowledgeQuestion.fromJson(json, locale),
        )
        .toList(growable: false);
  }
}
