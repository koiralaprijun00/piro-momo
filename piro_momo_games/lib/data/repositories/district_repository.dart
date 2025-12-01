import 'dart:convert';

import 'package:flutter/services.dart' show AssetBundle, rootBundle;

import '../models/district_entry.dart';

class DistrictRepository {
  DistrictRepository({AssetBundle? bundle}) : _bundle = bundle ?? rootBundle;

  final AssetBundle _bundle;
  List<DistrictEntry>? _cache;

  static const String _enPath = 'assets/data/name_district_en.json';
  static const String _assetMapPath = 'assets/data/district_assets.json';

  Future<List<DistrictEntry>> loadDistricts() async {
    if (_cache != null) {
      return _cache!;
    }

    final Map<String, dynamic> enJson = json.decode(
      await _bundle.loadString(_enPath),
    ) as Map<String, dynamic>;
    final List<dynamic> assetList = json.decode(
      await _bundle.loadString(_assetMapPath),
    ) as List<dynamic>;

    final Map<String, String> enNames =
        (enJson['districts'] as Map<String, dynamic>).map(
      (String key, dynamic value) => MapEntry(key, value as String),
    );
    final List<DistrictEntry> entries = assetList.map((dynamic raw) {
      final Map<String, dynamic> data = raw as Map<String, dynamic>;
      final String id = data['id'] as String;
      final String asset = data['asset'] as String;
      return DistrictEntry(
        id: id,
        englishName: enNames[id] ?? id,
        nepaliName: enNames[id] ?? id,
        assetPath: asset,
      );
    }).toList(growable: false);

    _cache = entries;
    return entries;
  }

}
