import 'dart:async';
import 'dart:math';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/analytics/analytics_service.dart';
import '../../../../core/persistence/progress_store.dart';
import '../../../../data/models/district_entry.dart';
import '../../../../data/models/game_locale.dart';
import '../../../../data/repositories/district_repository.dart';
import 'name_district_game_state.dart';

class NameDistrictGameController
    extends StateNotifier<NameDistrictGameState> {
  NameDistrictGameController({
    required DistrictRepository repository,
    required ProgressStore progressStore,
    required AnalyticsService analytics,
    NameDistrictGameState? initialState,
    Random? random,
  }) : _repository = repository,
       _progressStore = progressStore,
       _analytics = analytics,
       _random = random ?? Random(),
       super(initialState ?? NameDistrictGameState.initial());

  final DistrictRepository _repository;
  final ProgressStore _progressStore;
  final AnalyticsService _analytics;
  final Random _random;

  Future<void> loadDeck() async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final List<DistrictEntry> entries =
          List<DistrictEntry>.from(await _repository.loadDistricts());
      entries.shuffle(_random);
      final int persistedBest = await _progressStore.loadDistrictBestStreak();
      state = state.copyWith(
        deck: entries,
        currentIndex: 0,
        isLoading: false,
        isAnswered: false,
        currentOptions: _buildOptions(entries.first, state.locale, pool: entries),
        score: 0,
        correctCount: 0,
        incorrectCount: 0,
        streak: 0,
        bestStreak: persistedBest,
        clearSelection: true,
        clearAnswer: true,
      );
    } catch (error) {
      state = state.copyWith(isLoading: false, errorMessage: error.toString());
    }
  }

  void startGame() {
    if (!state.showOnboarding) {
      return;
    }
    if (state.deck.isEmpty) {
      loadDeck().then((_) {
        state = state.copyWith(showOnboarding: false);
      });
    } else {
      state = state.copyWith(showOnboarding: false);
    }
  }

  void changeLocale(GameLocale locale) {
    if (locale == state.locale) {
      return;
    }
    final DistrictEntry? current = state.currentDistrict;
    state = state.copyWith(
      locale: locale,
      currentOptions:
          current == null ? state.currentOptions : _buildOptions(current, locale),
    );
  }

  void updateAnswer(String value) {
    state = state.copyWith(userAnswer: value);
  }

  void submitGuess(String guess) {
    if (state.isLoading || state.isAnswered || state.deck.isEmpty) {
      return;
    }
    final DistrictEntry? current = state.currentDistrict;
    if (current == null) {
      return;
    }
    final String normalizedGuess = _normalize(guess);
    if (normalizedGuess.isEmpty) {
      return;
    }
    final bool isCorrect = _matches(current, normalizedGuess);

    final int updatedScore = state.score + (isCorrect ? 10 : 0);
    final int updatedCorrect = state.correctCount + (isCorrect ? 1 : 0);
    final int updatedIncorrect =
        state.incorrectCount + (isCorrect ? 0 : 1);
    final int updatedStreak = isCorrect ? state.streak + 1 : 0;
    final int updatedBest = max(state.bestStreak, updatedStreak);
    final bool improvedBest = updatedBest > state.bestStreak;

    state = state.copyWith(
      isAnswered: true,
      isCorrect: isCorrect,
      selectedOption: guess,
      score: updatedScore,
      correctCount: updatedCorrect,
      incorrectCount: updatedIncorrect,
      streak: updatedStreak,
      bestStreak: updatedBest,
    );

    if (improvedBest) {
      unawaited(_progressStore.saveDistrictBestStreak(updatedBest));
    }
    unawaited(_progressStore.maybeSaveDistrictBestScore(updatedScore));

    unawaited(
      _analytics.logEvent(
        'district_guess',
        parameters: <String, Object?>{
          'correct': isCorrect,
          'district_id': current.id,
          'locale': state.locale.languageCode,
        },
      ),
    );
  }

  void nextDistrict() {
    if (state.deck.isEmpty) {
      return;
    }
    int nextIndex = state.currentIndex + 1;
    if (nextIndex >= state.deck.length) {
      nextIndex = 0;
      state = state.copyWith(deck: List<DistrictEntry>.from(state.deck)..shuffle(_random));
    }
    final DistrictEntry next = state.deck[nextIndex];
    state = state.copyWith(
      currentIndex: nextIndex,
      isAnswered: false,
      currentOptions: _buildOptions(next, state.locale),
      clearSelection: true,
      clearAnswer: true,
    );
  }

  void restart() {
    if (state.deck.isEmpty) {
      loadDeck();
      return;
    }
    final List<DistrictEntry> shuffled =
        List<DistrictEntry>.from(state.deck)..shuffle(_random);
    state = state.copyWith(
      deck: shuffled,
      currentIndex: 0,
      isAnswered: false,
      score: 0,
      correctCount: 0,
      incorrectCount: 0,
      streak: 0,
      currentOptions: _buildOptions(
        shuffled.first,
        state.locale,
        pool: shuffled,
      ),
      clearSelection: true,
      clearAnswer: true,
    );
  }

  List<String> _buildOptions(
    DistrictEntry entry,
    GameLocale locale, {
    List<DistrictEntry>? pool,
  }) {
    final List<String> source = (pool ?? state.deck)
        .map((DistrictEntry e) => e.localizedName(locale))
        .toList();
    if (!source.contains(entry.localizedName(locale))) {
      source.add(entry.localizedName(locale));
    }
    source.shuffle(_random);
    final Set<String> options = <String>{entry.localizedName(locale)};
    for (final String candidate in source) {
      if (options.length >= 4) {
        break;
      }
      options.add(candidate);
    }
    final List<String> result = options.toList()
      ..shuffle(_random);
    return result;
  }

  bool _matches(DistrictEntry entry, String guess) {
    return _normalize(entry.englishName) == guess ||
        _normalize(entry.nepaliName) == guess;
  }

  String _normalize(String value) {
    return value
        .toLowerCase()
        .replaceAll(RegExp(r'[^a-z0-9\u0900-\u097F]+'), '')
        .trim();
  }
}
