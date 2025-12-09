import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../data/providers.dart';
import 'name_district_game_controller.dart';
import 'name_district_game_state.dart';

final AutoDisposeStateNotifierProvider<
  NameDistrictGameController,
  NameDistrictGameState
> nameDistrictGameControllerProvider =
    StateNotifierProvider.autoDispose<NameDistrictGameController,
        NameDistrictGameState>((Ref ref) {
      final controller = NameDistrictGameController(
        repository: ref.read(districtRepositoryProvider),
        progressStore: ref.watch(progressStoreProvider),
        analytics: ref.read(analyticsServiceProvider),
        cloudProgress: ref.read(cloudProgressServiceProvider),
      );
      controller.loadDeck();
      return controller;
    });
