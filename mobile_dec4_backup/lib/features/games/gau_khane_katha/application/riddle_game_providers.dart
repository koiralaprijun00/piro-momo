import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../data/providers.dart';
import 'riddle_game_controller.dart';
import 'riddle_game_state.dart';

final AutoDisposeStateNotifierProvider<RiddleGameController, RiddleGameState>
riddleGameControllerProvider =
    StateNotifierProvider.autoDispose<RiddleGameController, RiddleGameState>((
      ref,
    ) {
      final controller = RiddleGameController(
        repository: ref.read(riddleRepositoryProvider),
        progressStore: ref.watch(progressStoreProvider),
        analytics: ref.read(analyticsServiceProvider),
        cloudProgress: ref.read(cloudProgressServiceProvider),
      );
      controller.loadDeck();
      return controller;
    });
