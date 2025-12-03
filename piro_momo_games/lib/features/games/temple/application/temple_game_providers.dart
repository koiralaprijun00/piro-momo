import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../data/providers.dart';
import 'temple_game_controller.dart';
import 'temple_game_state.dart';

final AutoDisposeStateNotifierProvider<TempleGameController, TempleGameState>
    templeGameControllerProvider =
    StateNotifierProvider.autoDispose<TempleGameController, TempleGameState>(
        (Ref ref) {
  final controller = TempleGameController(
    repository: ref.read(templeRepositoryProvider),
    progressStore: ref.watch(progressStoreProvider),
    analytics: ref.read(analyticsServiceProvider),
    cloudProgress: ref.read(cloudProgressServiceProvider),
  );
  controller.loadDeck();
  return controller;
});
