import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../data/providers.dart';
import 'general_knowledge_game_controller.dart';
import 'general_knowledge_game_state.dart';

final AutoDisposeStateNotifierProvider<
  GeneralKnowledgeGameController,
  GeneralKnowledgeGameState
>
generalKnowledgeGameControllerProvider =
    StateNotifierProvider.autoDispose<
      GeneralKnowledgeGameController,
      GeneralKnowledgeGameState
    >((ref) {
      final controller = GeneralKnowledgeGameController(
        repository: ref.read(generalKnowledgeRepositoryProvider),
        progressStore: ref.watch(progressStoreProvider),
        analytics: ref.read(analyticsServiceProvider),
        cloudProgress: ref.read(cloudProgressServiceProvider),
      );
      controller.loadDeck();
      return controller;
    });
