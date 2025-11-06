import 'package:shared_preferences/shared_preferences.dart';

class ProgressStore {
  ProgressStore();

  static const String _festivalBestKey = 'progress.festival.bestStreak';
  static const String _riddleBestKey = 'progress.riddle.bestStreak';

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
}
