import 'package:shared_preferences/shared_preferences.dart';

/// Enum representing different game types for progress tracking.
enum GameType {
  festival('festival'),
  riddle('riddle'),
  generalKnowledge('generalKnowledge'),
  kings('kings'),
  district('district'),
  temple('temple');

  const GameType(this.key);
  final String key;
}

class ProgressStore {
  ProgressStore({String? userId}) : _userId = userId;

  final String? _userId;

  // Game type to key mapping
  static const Map<GameType, String> _streakKeys = {
    GameType.festival: 'progress.festival.bestStreak',
    GameType.riddle: 'progress.riddle.bestStreak',
    GameType.generalKnowledge: 'progress.generalKnowledge.bestStreak',
    GameType.kings: 'progress.kings.bestStreak',
    GameType.district: 'progress.district.bestStreak',
    GameType.temple: 'progress.temple.bestStreak',
  };

  static const Map<GameType, String> _scoreKeys = {
    GameType.festival: 'progress.festival.bestScore',
    GameType.riddle: 'progress.riddle.bestScore',
    GameType.generalKnowledge: 'progress.generalKnowledge.bestScore',
    GameType.kings: 'progress.kings.bestScore',
    GameType.district: 'progress.district.bestScore',
    GameType.temple: 'progress.temple.bestScore',
  };

  static const String _latestGameIdKey = 'progress.latest.gameId';
  static const String _latestGameScoreKey = 'progress.latest.score';
  static const String _latestGameTimestampKey = 'progress.latest.timestamp';

  SharedPreferences? _prefs;

  String _key(String base) => '${_userId ?? 'guest'}.$base';

  Future<SharedPreferences> _instance() async {
    return _prefs ??= await SharedPreferences.getInstance();
  }

  // Generic methods for streak operations
  Future<int> loadBestStreak(GameType game) async {
    final prefs = await _instance();
    final key = _streakKeys[game];
    if (key == null) {
      throw ArgumentError('Invalid game type: $game');
    }
    return prefs.getInt(_key(key)) ?? 0;
  }

  Future<void> saveBestStreak(GameType game, int value) async {
    final prefs = await _instance();
    final key = _streakKeys[game];
    if (key == null) {
      throw ArgumentError('Invalid game type: $game');
    }
    await prefs.setInt(_key(key), value);
  }

  // Generic methods for score operations
  Future<int> loadBestScore(GameType game) async {
    final prefs = await _instance();
    final key = _scoreKeys[game];
    if (key == null) {
      throw ArgumentError('Invalid game type: $game');
    }
    return prefs.getInt(_key(key)) ?? 0;
  }

  Future<void> maybeSaveBestScore(GameType game, int value) async {
    final prefs = await _instance();
    final key = _scoreKeys[game];
    if (key == null) {
      throw ArgumentError('Invalid game type: $game');
    }
    final prefKey = _key(key);
    final current = prefs.getInt(prefKey) ?? 0;
    if (value > current) {
      await prefs.setInt(prefKey, value);
    }
  }

  // Legacy methods for backward compatibility
  // These delegate to the generic methods above
  Future<int> loadFestivalBestStreak() => loadBestStreak(GameType.festival);
  Future<void> saveFestivalBestStreak(int value) =>
      saveBestStreak(GameType.festival, value);
  Future<int> loadRiddleBestStreak() => loadBestStreak(GameType.riddle);
  Future<void> saveRiddleBestStreak(int value) =>
      saveBestStreak(GameType.riddle, value);
  Future<int> loadGkBestStreak() =>
      loadBestStreak(GameType.generalKnowledge);
  Future<void> saveGkBestStreak(int value) =>
      saveBestStreak(GameType.generalKnowledge, value);
  Future<int> loadKingsBestStreak() => loadBestStreak(GameType.kings);
  Future<void> saveKingsBestStreak(int value) =>
      saveBestStreak(GameType.kings, value);
  Future<int> loadDistrictBestStreak() => loadBestStreak(GameType.district);
  Future<void> saveDistrictBestStreak(int value) =>
      saveBestStreak(GameType.district, value);
  Future<int> loadTempleBestStreak() => loadBestStreak(GameType.temple);
  Future<void> saveTempleBestStreak(int value) =>
      saveBestStreak(GameType.temple, value);

  Future<int> loadFestivalBestScore() => loadBestScore(GameType.festival);
  Future<int> loadRiddleBestScore() => loadBestScore(GameType.riddle);
  Future<int> loadGkBestScore() => loadBestScore(GameType.generalKnowledge);
  Future<int> loadKingsBestScore() => loadBestScore(GameType.kings);
  Future<int> loadDistrictBestScore() => loadBestScore(GameType.district);
  Future<int> loadTempleBestScore() => loadBestScore(GameType.temple);

  Future<void> maybeSaveFestivalBestScore(int value) =>
      maybeSaveBestScore(GameType.festival, value);
  Future<void> maybeSaveRiddleBestScore(int value) =>
      maybeSaveBestScore(GameType.riddle, value);
  Future<void> maybeSaveGkBestScore(int value) =>
      maybeSaveBestScore(GameType.generalKnowledge, value);
  Future<void> maybeSaveKingsBestScore(int value) =>
      maybeSaveBestScore(GameType.kings, value);
  Future<void> maybeSaveDistrictBestScore(int value) =>
      maybeSaveBestScore(GameType.district, value);
  Future<void> maybeSaveTempleBestScore(int value) =>
      maybeSaveBestScore(GameType.temple, value);

  Future<int> loadBestStreakAcrossGames() async {
    final values = await Future.wait(
      GameType.values.map((game) => loadBestStreak(game)),
    );
    return values.fold<int>(0, (maxValue, current) {
      return current > maxValue ? current : maxValue;
    });
  }

  Future<int> loadBestScoreAcrossGames() async {
    final values = await Future.wait(
      GameType.values.map((game) => loadBestScore(game)),
    );
    return values.fold<int>(0, (maxValue, current) {
      return current > maxValue ? current : maxValue;
    });
  }

  Future<void> saveLatestGame(String gameId, int score) async {
    final prefs = await _instance();
    await prefs.setString(_key(_latestGameIdKey), gameId);
    await prefs.setInt(_key(_latestGameScoreKey), score);
    await prefs.setInt(
      _key(_latestGameTimestampKey),
      DateTime.now().millisecondsSinceEpoch,
    );
  }

  Future<Map<String, dynamic>?> loadLatestGame() async {
    final prefs = await _instance();
    final gameId = prefs.getString(_key(_latestGameIdKey));
    if (gameId == null) return null;

    final score = prefs.getInt(_key(_latestGameScoreKey)) ?? 0;
    final timestamp = prefs.getInt(_key(_latestGameTimestampKey));

    return <String, dynamic>{
      'gameId': gameId,
      'score': score,
      'timestamp': timestamp != null
          ? DateTime.fromMillisecondsSinceEpoch(timestamp)
          : null,
    };
  }
}
