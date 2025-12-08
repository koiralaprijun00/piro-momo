import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../data/providers.dart';
import 'festival_game_controller.dart';
import 'festival_game_state.dart';

final AutoDisposeStateNotifierProvider<
  FestivalGameController,
  FestivalGameState
>
festivalGameControllerProvider =
    StateNotifierProvider.autoDispose<
      FestivalGameController,
      FestivalGameState
    >((ref) {
      final controller = FestivalGameController(
        repository: ref.read(festivalRepositoryProvider),
        progressStore: ref.watch(progressStoreProvider),
        analytics: ref.read(analyticsServiceProvider),
      );
      controller.loadDeck();
      return controller;
    });
