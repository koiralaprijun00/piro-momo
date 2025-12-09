import 'dart:convert';

import 'package:flutter/services.dart' show AssetBundle, rootBundle;

import '../models/festival_question.dart';

class FestivalRepository {
  FestivalRepository({AssetBundle? bundle}) : _bundle = bundle ?? rootBundle;

  final AssetBundle _bundle;
  List<FestivalQuestion>? _cache;
  Future<List<FestivalQuestion>>? _inFlight;

  static const String _assetPath = 'assets/data/guess_festival_en.json';

  Future<List<FestivalQuestion>> loadQuestions() {
    if (_cache != null) {
      return Future<List<FestivalQuestion>>.value(_cache!);
    }

    if (_inFlight != null) {
      return _inFlight!;
    }

    final Future<List<FestivalQuestion>> loader = _loadFromAsset();
    _inFlight = loader;

    return loader.then((List<FestivalQuestion> questions) {
      _cache = questions;
      _inFlight = null;
      return questions;
    });
  }

  FestivalQuestion? findById(String id) {
    final List<FestivalQuestion>? questions = _cache;
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

  Future<List<FestivalQuestion>> _loadFromAsset() async {
    final String raw = await _bundle.loadString(_assetPath);
    final List<dynamic> decoded = json.decode(raw) as List<dynamic>;

    return decoded
        .cast<Map<String, dynamic>>()
        .map(
          (Map<String, dynamic> json) =>
              FestivalQuestion.fromJson(json),
        )
        .toList(growable: false);
  }
}
