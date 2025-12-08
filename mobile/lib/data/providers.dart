import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/analytics/analytics_service.dart';
import '../core/persistence/progress_store.dart';
import 'models/district_entry.dart';
import 'models/festival_question.dart';
import 'models/general_knowledge_question.dart';
import 'models/king_entry.dart';
import 'models/riddle_entry.dart';
import 'repositories/district_repository.dart';
import 'repositories/festival_repository.dart';
import 'repositories/general_knowledge_repository.dart';
import 'repositories/kings_repository.dart';
import 'repositories/riddle_repository.dart';
import '../features/auth/providers/auth_providers.dart';

final Provider<FestivalRepository> festivalRepositoryProvider =
    Provider<FestivalRepository>((Ref ref) {
      return FestivalRepository();
    });

final Provider<RiddleRepository> riddleRepositoryProvider =
    Provider<RiddleRepository>((Ref ref) {
      return RiddleRepository();
    });

final Provider<GeneralKnowledgeRepository> generalKnowledgeRepositoryProvider =
    Provider<GeneralKnowledgeRepository>((Ref ref) {
      return GeneralKnowledgeRepository();
    });

final Provider<KingsRepository> kingsRepositoryProvider =
    Provider<KingsRepository>((Ref ref) {
      return KingsRepository();
    });

final Provider<DistrictRepository> districtRepositoryProvider =
    Provider<DistrictRepository>((Ref ref) {
      return DistrictRepository();
    });

final Provider<ProgressStore> progressStoreProvider = Provider<ProgressStore>(
  (Ref ref) {
    final AsyncValue<User?> authState = ref.watch(authStateProvider);
    final String? userId = authState.asData?.value?.uid;
    return ProgressStore(userId: userId);
  },
);

final Provider<AnalyticsService> analyticsServiceProvider =
    Provider<AnalyticsService>((Ref ref) => const AnalyticsService());

final AutoDisposeFutureProvider<List<FestivalQuestion>>
    festivalQuestionsProvider =
    FutureProvider.autoDispose<List<FestivalQuestion>>((ref) async {
  final FestivalRepository repository = ref.read(
    festivalRepositoryProvider,
  );
  return repository.loadQuestions();
});

final AutoDisposeFutureProvider<List<GeneralKnowledgeQuestion>>
    generalKnowledgeQuestionsProvider =
    FutureProvider.autoDispose<List<GeneralKnowledgeQuestion>>((ref) async {
  final GeneralKnowledgeRepository repository = ref.read(
    generalKnowledgeRepositoryProvider,
  );
  return repository.loadQuestions();
});

final AutoDisposeFutureProvider<List<RiddleEntry>> riddleEntriesProvider =
    FutureProvider.autoDispose<List<RiddleEntry>>((ref) async {
  final RiddleRepository repository = ref.read(riddleRepositoryProvider);
  return repository.loadRiddles();
});

final AutoDisposeFutureProvider<List<KingEntry>> kingsEntriesProvider =
    FutureProvider.autoDispose<List<KingEntry>>((ref) async {
  final KingsRepository repository = ref.read(kingsRepositoryProvider);
  return repository.loadKings();
});

final AutoDisposeFutureProvider<List<DistrictEntry>> districtEntriesProvider =
    FutureProvider.autoDispose<List<DistrictEntry>>((Ref ref) async {
      final DistrictRepository repository = ref.read(districtRepositoryProvider);
      return repository.loadDistricts();
    });
