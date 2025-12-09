import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../data/providers.dart';
import 'kings_game_controller.dart';
import 'kings_game_state.dart';

final AutoDisposeStateNotifierProvider<KingsGameController, KingsGameState>
    kingsGameControllerProvider =
    StateNotifierProvider.autoDispose<KingsGameController, KingsGameState>(
      (Ref ref) {
        final controller = KingsGameController(
          repository: ref.read(kingsRepositoryProvider),
          progressStore: ref.watch(progressStoreProvider),
          analytics: ref.read(analyticsServiceProvider),
          cloudProgress: ref.read(cloudProgressServiceProvider),
        );
        controller.loadDeck();
        return controller;
      },
    );
