import 'package:cloud_firestore/cloud_firestore.dart';

/// Lightweight cloud sync for user progress.
/// No-ops if userId is null; failures are swallowed to avoid blocking gameplay.
class CloudProgressService {
  CloudProgressService({
    required this.userId,
    FirebaseFirestore? firestore,
  }) : _firestore = firestore ?? FirebaseFirestore.instance;

  final String? userId;
  final FirebaseFirestore _firestore;

  bool get _enabled => userId != null;

  /// Updates the best score/streak for a given game.
  Future<void> updateProgress({
    required String gameId,
    int? bestScore,
    int? bestStreak,
  }) async {
    if (!_enabled) return;
    try {
      final DocumentReference<Map<String, dynamic>> doc = _firestore
          .collection('users')
          .doc(userId)
          .collection('progress')
          .doc(gameId);
      await doc.set(
        <String, dynamic>{
          if (bestScore != null) 'bestScore': bestScore,
          if (bestStreak != null) 'bestStreak': bestStreak,
          'updatedAt': FieldValue.serverTimestamp(),
        },
        SetOptions(merge: true),
      );
    } catch (_) {
      // Ignore sync failures to avoid breaking gameplay.
    }
  }
}
