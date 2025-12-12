import 'dart:convert';

import 'package:flutter/services.dart' show AssetBundle, rootBundle;

import '../exceptions.dart';
import '../models/general_knowledge_question.dart';

class GeneralKnowledgeRepository {
  GeneralKnowledgeRepository({AssetBundle? bundle})
    : _bundle = bundle ?? rootBundle;

  final AssetBundle _bundle;
  List<GeneralKnowledgeQuestion>? _cache;
  Future<List<GeneralKnowledgeQuestion>>? _inFlight;

  static const String _assetPath = 'assets/data/general_knowledge_en.json';

  Future<List<GeneralKnowledgeQuestion>> loadQuestions() {
    if (_cache != null) {
      return Future<List<GeneralKnowledgeQuestion>>.value(_cache!);
    }

    if (_inFlight != null) {
      return _inFlight!;
    }

    final Future<List<GeneralKnowledgeQuestion>> loader = _loadFromAsset();
    _inFlight = loader;

    return loader.then((List<GeneralKnowledgeQuestion> questions) {
      _cache = questions;
      _inFlight = null;
      return questions;
    });
  }

  Future<List<GeneralKnowledgeQuestion>> _loadFromAsset() async {
    try {
      final String raw = await _bundle.loadString(_assetPath);
      final List<dynamic> decoded = json.decode(raw) as List<dynamic>;

      return decoded
          .cast<Map<String, dynamic>>()
          .map(
            (Map<String, dynamic> json) =>
                GeneralKnowledgeQuestion.fromJson(json),
          )
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
