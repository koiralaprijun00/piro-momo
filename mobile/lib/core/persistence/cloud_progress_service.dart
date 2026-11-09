import 'package:cloud_firestore/cloud_firestore.dart';

/// Lightweight cloud sync for user progress.
/// No-ops if userId is null; failures are swallowed to avoid blocking gameplay.
///
/// Only verified accounts sync (same rule as the web app), and the cloud always
/// keeps the higher score/streak: a lower value from another device or a fresh
/// install never overwrites a better one.
class CloudProgressService {
  CloudProgressService({
    required this.userId,
    bool Function()? isVerified,
    FirebaseFirestore? firestore,
  })  : _isVerified = isVerified ?? (() => true),
        _firestore = firestore ?? FirebaseFirestore.instance;

  final String? userId;
  final bool Function() _isVerified;
  final FirebaseFirestore _firestore;

  bool get _enabled => userId != null && _isVerified();

  /// Raises the saved best score/streak for a game. Never lowers them.
  Future<void> updateProgress({
    required String gameId,
    int? bestScore,
    int? bestStreak,
  }) async {
    if (!_enabled) return;
    if (bestScore == null && bestStreak == null) return;
    try {
      final DocumentReference<Map<String, dynamic>> doc = _firestore
          .collection('users')
          .doc(userId)
          .collection('progress')
          .doc(gameId);
      await _firestore.runTransaction<void>((Transaction transaction) async {
        final DocumentSnapshot<Map<String, dynamic>> snapshot =
            await transaction.get(doc);
        final Map<String, dynamic> current =
            snapshot.data() ?? <String, dynamic>{};
        final int savedScore = (current['bestScore'] as num?)?.toInt() ?? 0;
        final int savedStreak = (current['bestStreak'] as num?)?.toInt() ?? 0;

        final Map<String, dynamic> update = <String, dynamic>{
          if (bestScore != null && bestScore > savedScore) 'bestScore': bestScore,
          if (bestStreak != null && bestStreak > savedStreak)
            'bestStreak': bestStreak,
        };
        if (update.isEmpty) return; // Cloud already has an equal or better result.

        update['updatedAt'] = FieldValue.serverTimestamp();
        transaction.set(doc, update, SetOptions(merge: true));
      });
    } catch (_) {
      // Ignore sync failures to avoid breaking gameplay.
    }
  }
}
