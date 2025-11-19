import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/analytics/analytics_service.dart';
import '../core/persistence/progress_store.dart';
import 'models/district_entry.dart';
import 'models/festival_question.dart';
import 'models/game_locale.dart';
import 'models/general_knowledge_question.dart';
import 'models/king_entry.dart';
import 'models/riddle_entry.dart';
import 'repositories/district_repository.dart';
import 'repositories/festival_repository.dart';
import 'repositories/general_knowledge_repository.dart';
import 'repositories/kings_repository.dart';
import 'repositories/riddle_repository.dart';

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
  (Ref ref) => ProgressStore(),
);

final Provider<AnalyticsService> analyticsServiceProvider =
    Provider<AnalyticsService>((Ref ref) => const AnalyticsService());

final AutoDisposeFutureProviderFamily<List<FestivalQuestion>, GameLocale>
festivalQuestionsProvider = FutureProvider.autoDispose
    .family<List<FestivalQuestion>, GameLocale>((ref, locale) async {
      final FestivalRepository repository = ref.read(
        festivalRepositoryProvider,
      );
      return repository.loadQuestions(locale);
    });

final AutoDisposeFutureProviderFamily<
  List<GeneralKnowledgeQuestion>,
  GameLocale
>
generalKnowledgeQuestionsProvider = FutureProvider.autoDispose
    .family<List<GeneralKnowledgeQuestion>, GameLocale>((ref, locale) async {
      final GeneralKnowledgeRepository repository = ref.read(
        generalKnowledgeRepositoryProvider,
      );
      return repository.loadQuestions(locale);
    });

final AutoDisposeFutureProviderFamily<List<RiddleEntry>, GameLocale>
riddleEntriesProvider = FutureProvider.autoDispose
    .family<List<RiddleEntry>, GameLocale>((ref, locale) async {
      final RiddleRepository repository = ref.read(riddleRepositoryProvider);
      return repository.loadRiddles(locale);
    });

final AutoDisposeFutureProviderFamily<List<KingEntry>, GameLocale>
    kingsEntriesProvider = FutureProvider.autoDispose
        .family<List<KingEntry>, GameLocale>((ref, locale) async {
          final KingsRepository repository = ref.read(kingsRepositoryProvider);
          return repository.loadKings(locale);
        });

final AutoDisposeFutureProvider<List<DistrictEntry>> districtEntriesProvider =
    FutureProvider.autoDispose<List<DistrictEntry>>((Ref ref) async {
      final DistrictRepository repository = ref.read(districtRepositoryProvider);
      return repository.loadDistricts();
    });
