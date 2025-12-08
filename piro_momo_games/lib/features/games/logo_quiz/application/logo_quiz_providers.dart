import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'logo_quiz_controller.dart';
import 'logo_quiz_state.dart';

final logoQuizControllerProvider =
    StateNotifierProvider.autoDispose<LogoQuizController, LogoQuizState>((ref) {
  return LogoQuizController();
});
