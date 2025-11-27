import 'package:shared_preferences/shared_preferences.dart';

class ProgressStore {
  ProgressStore({String? userId}) : _userId = userId;

  final String? _userId;

  static const String _festivalBestKey = 'progress.festival.bestStreak';
  static const String _riddleBestKey = 'progress.riddle.bestStreak';
  static const String _gkBestKey = 'progress.generalKnowledge.bestStreak';
  static const String _kingsBestKey = 'progress.kings.bestStreak';
  static const String _districtBestKey = 'progress.district.bestStreak';

  static const String _festivalBestScoreKey = 'progress.festival.bestScore';
  static const String _riddleBestScoreKey = 'progress.riddle.bestScore';
  static const String _gkBestScoreKey = 'progress.generalKnowledge.bestScore';
  static const String _kingsBestScoreKey = 'progress.kings.bestScore';
  static const String _districtBestScoreKey = 'progress.district.bestScore';

  SharedPreferences? _prefs;

  String _key(String base) => '${_userId ?? 'guest'}.$base';

  Future<SharedPreferences> _instance() async {
    return _prefs ??= await SharedPreferences.getInstance();
  }

  Future<int> loadFestivalBestStreak() async {
    final SharedPreferences prefs = await _instance();
    return prefs.getInt(_key(_festivalBestKey)) ?? 0;
  }

  Future<int> loadRiddleBestStreak() async {
    final SharedPreferences prefs = await _instance();
    return prefs.getInt(_key(_riddleBestKey)) ?? 0;
  }

  Future<void> saveFestivalBestStreak(int value) async {
    final SharedPreferences prefs = await _instance();
    await prefs.setInt(_key(_festivalBestKey), value);
  }

  Future<void> saveRiddleBestStreak(int value) async {
    final SharedPreferences prefs = await _instance();
    await prefs.setInt(_key(_riddleBestKey), value);
  }

  Future<int> loadGkBestStreak() async {
    final SharedPreferences prefs = await _instance();
    return prefs.getInt(_key(_gkBestKey)) ?? 0;
  }

  Future<void> saveGkBestStreak(int value) async {
    final SharedPreferences prefs = await _instance();
    await prefs.setInt(_key(_gkBestKey), value);
  }

  Future<int> loadKingsBestStreak() async {
    final SharedPreferences prefs = await _instance();
    return prefs.getInt(_key(_kingsBestKey)) ?? 0;
  }

  Future<void> saveKingsBestStreak(int value) async {
    final SharedPreferences prefs = await _instance();
    await prefs.setInt(_key(_kingsBestKey), value);
  }

  Future<int> loadDistrictBestStreak() async {
    final SharedPreferences prefs = await _instance();
    return prefs.getInt(_key(_districtBestKey)) ?? 0;
  }

  Future<void> saveDistrictBestStreak(int value) async {
    final SharedPreferences prefs = await _instance();
    await prefs.setInt(_key(_districtBestKey), value);
  }

  Future<int> loadFestivalBestScore() async {
    final SharedPreferences prefs = await _instance();
    return prefs.getInt(_key(_festivalBestScoreKey)) ?? 0;
  }

  Future<int> loadRiddleBestScore() async {
    final SharedPreferences prefs = await _instance();
    return prefs.getInt(_key(_riddleBestScoreKey)) ?? 0;
  }

  Future<int> loadGkBestScore() async {
    final SharedPreferences prefs = await _instance();
    return prefs.getInt(_key(_gkBestScoreKey)) ?? 0;
  }

  Future<int> loadKingsBestScore() async {
    final SharedPreferences prefs = await _instance();
    return prefs.getInt(_key(_kingsBestScoreKey)) ?? 0;
  }

  Future<int> loadDistrictBestScore() async {
    final SharedPreferences prefs = await _instance();
    return prefs.getInt(_key(_districtBestScoreKey)) ?? 0;
  }

  Future<void> maybeSaveFestivalBestScore(int value) async {
    final SharedPreferences prefs = await _instance();
    final String key = _key(_festivalBestScoreKey);
    final int current = prefs.getInt(key) ?? 0;
    if (value > current) {
      await prefs.setInt(key, value);
    }
  }

  Future<void> maybeSaveRiddleBestScore(int value) async {
    final SharedPreferences prefs = await _instance();
    final String key = _key(_riddleBestScoreKey);
    final int current = prefs.getInt(key) ?? 0;
    if (value > current) {
      await prefs.setInt(key, value);
    }
  }

  Future<void> maybeSaveGkBestScore(int value) async {
    final SharedPreferences prefs = await _instance();
    final String key = _key(_gkBestScoreKey);
    final int current = prefs.getInt(key) ?? 0;
    if (value > current) {
      await prefs.setInt(key, value);
    }
  }

  Future<void> maybeSaveKingsBestScore(int value) async {
    final SharedPreferences prefs = await _instance();
    final String key = _key(_kingsBestScoreKey);
    final int current = prefs.getInt(key) ?? 0;
    if (value > current) {
      await prefs.setInt(key, value);
    }
  }

  Future<void> maybeSaveDistrictBestScore(int value) async {
    final SharedPreferences prefs = await _instance();
    final String key = _key(_districtBestScoreKey);
    final int current = prefs.getInt(key) ?? 0;
    if (value > current) {
      await prefs.setInt(key, value);
    }
  }

  Future<int> loadBestStreakAcrossGames() async {
    final List<int> values = await Future.wait(<Future<int>>[
      loadFestivalBestStreak(),
      loadRiddleBestStreak(),
      loadGkBestStreak(),
      loadKingsBestStreak(),
      loadDistrictBestStreak(),
    ]);
    return values.fold<int>(0, (int maxValue, int current) {
      return current > maxValue ? current : maxValue;
    });
  }

  Future<int> loadBestScoreAcrossGames() async {
    final List<int> values = await Future.wait(<Future<int>>[
      loadFestivalBestScore(),
      loadRiddleBestScore(),
      loadGkBestScore(),
      loadKingsBestScore(),
      loadDistrictBestScore(),
    ]);
    return values.fold<int>(0, (int maxValue, int current) {
      return current > maxValue ? current : maxValue;
    });
  }
}
