import 'game_locale.dart';

class DistrictEntry {
  const DistrictEntry({
    required this.id,
    required this.englishName,
    required this.nepaliName,
    required this.assetPath,
  });

  final String id;
  final String englishName;
  final String nepaliName;
  final String assetPath;

  String localizedName(GameLocale locale) {
    return locale == GameLocale.nepali ? nepaliName : englishName;
  }
}
