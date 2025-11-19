import 'package:shared_preferences/shared_preferences.dart';

class ProgressStore {
  ProgressStore();

  static const String _festivalBestKey = 'progress.festival.bestStreak';
  static const String _riddleBestKey = 'progress.riddle.bestStreak';
  static const String _gkBestKey = 'progress.generalKnowledge.bestStreak';
  static const String _kingsBestKey = 'progress.kings.bestStreak';
  static const String _districtBestKey = 'progress.district.bestStreak';

  SharedPreferences? _prefs;

  Future<SharedPreferences> _instance() async {
    return _prefs ??= await SharedPreferences.getInstance();
  }

  Future<int> loadFestivalBestStreak() async {
    final SharedPreferences prefs = await _instance();
    return prefs.getInt(_festivalBestKey) ?? 0;
  }

  Future<int> loadRiddleBestStreak() async {
    final SharedPreferences prefs = await _instance();
    return prefs.getInt(_riddleBestKey) ?? 0;
  }

  Future<void> saveFestivalBestStreak(int value) async {
    final SharedPreferences prefs = await _instance();
    await prefs.setInt(_festivalBestKey, value);
  }

  Future<void> saveRiddleBestStreak(int value) async {
    final SharedPreferences prefs = await _instance();
    await prefs.setInt(_riddleBestKey, value);
  }

  Future<int> loadGkBestStreak() async {
    final SharedPreferences prefs = await _instance();
    return prefs.getInt(_gkBestKey) ?? 0;
  }

  Future<void> saveGkBestStreak(int value) async {
    final SharedPreferences prefs = await _instance();
    await prefs.setInt(_gkBestKey, value);
  }

  Future<int> loadKingsBestStreak() async {
    final SharedPreferences prefs = await _instance();
    return prefs.getInt(_kingsBestKey) ?? 0;
  }

  Future<void> saveKingsBestStreak(int value) async {
    final SharedPreferences prefs = await _instance();
    await prefs.setInt(_kingsBestKey, value);
  }

  Future<int> loadDistrictBestStreak() async {
    final SharedPreferences prefs = await _instance();
    return prefs.getInt(_districtBestKey) ?? 0;
  }

  Future<void> saveDistrictBestStreak(int value) async {
    final SharedPreferences prefs = await _instance();
    await prefs.setInt(_districtBestKey, value);
  }
}
