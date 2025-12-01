import 'dart:convert';

import 'package:flutter/services.dart' show AssetBundle, rootBundle;

import '../models/riddle_entry.dart';

class RiddleRepository {
  RiddleRepository({AssetBundle? bundle}) : _bundle = bundle ?? rootBundle;

  final AssetBundle _bundle;
  List<RiddleEntry>? _cache;
  Future<List<RiddleEntry>>? _inFlight;

  static const String _assetPath = 'assets/data/gau_khane_katha_en.json';

  Future<List<RiddleEntry>> loadRiddles() {
    if (_cache != null) {
      return Future<List<RiddleEntry>>.value(_cache!);
    }

    if (_inFlight != null) {
      return _inFlight!;
    }

    final Future<List<RiddleEntry>> loader = _loadFromAsset();
    _inFlight = loader;
    return loader.then((List<RiddleEntry> riddles) {
      _cache = riddles;
      _inFlight = null;
      return riddles;
    });
  }

  RiddleEntry? findById(String id) {
    final List<RiddleEntry>? riddles = _cache;
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

  Future<List<RiddleEntry>> _loadFromAsset() async {
    final String raw = await _bundle.loadString(_assetPath);
    final List<dynamic> decoded = json.decode(raw) as List<dynamic>;

    return decoded
        .cast<Map<String, dynamic>>()
        .map((Map<String, dynamic> json) => RiddleEntry.fromJson(json))
        .toList(growable: false);
  }
}
