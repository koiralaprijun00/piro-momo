/// The one lifecycle every mobile game follows. Each game state exposes a
/// `phase` getter worked out from its existing fields, so screens can
/// `switch (state.phase)` instead of checking several booleans in a row.
///
///   onboarding ──start──▶ loading ──▶ playing ──answer──▶ answered ──next──▶ playing
///                            │           └──────── last question / won ──▶ finished
///                            └──▶ error ──retry──▶ loading
///
/// Same phases as the web games (`web/src/lib/games/*`).
enum GamePhase {
  /// Intro screen before the first round.
  onboarding,

  /// Loading questions; nothing to show yet.
  loading,

  /// Loading failed; show the error and a retry button.
  error,

  /// Waiting for the player's answer.
  playing,

  /// The current answer is revealed; waiting for "next".
  answered,

  /// The game is over (all done, won, gave up, or time ran out).
  finished,
}

/// Works out the phase from the flags every game state has.
/// Order matters: onboarding wins over loading (the intro shows while loading),
/// and loading only counts while there is nothing to show yet.
GamePhase resolveGamePhase({
  required bool showOnboarding,
  required bool isLoading,
  required bool hasContent,
  required bool hasError,
  required bool isFinished,
  required bool isAnswered,
}) {
  if (showOnboarding) return GamePhase.onboarding;
  if (isLoading && !hasContent) return GamePhase.loading;
  if (hasError) return GamePhase.error;
  if (isFinished) return GamePhase.finished;
  if (isAnswered) return GamePhase.answered;
  return GamePhase.playing;
}
