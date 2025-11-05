# Piro Momo Games (Flutter)

Mobile companion for the Piro Momo experiences. Phase 1 lays the foundation for the Guess the Festival and Gau Khane Katha games with shared theming, routing, and a NYTimes-style hub screen.

## Project Overview

- Flutter 3 · Material 3 with a bespoke light/dark color scheme aligned to the existing web gradients.
- `go_router` powers navigation (home hub ➜ individual game shells).
- Custom typography pairing DM Sans with Noto Serif Devanagari via `google_fonts`.
- Reusable gradient + chip styling to mirror the web aesthetic.

## Getting Started

```bash
cd piro_momo_games
flutter pub get
flutter run
```

The default entry launches the hub screen where each game card routes to a placeholder shell for upcoming gameplay work.

## Key Structure

- `lib/app.dart` – root `MaterialApp.router` with theme wiring.
- `lib/core/theme/` – palette, typography, and theme extensions.
- `lib/features/home/` – hub screen, game definitions, and cards.
- `lib/features/games/...` – placeholder shells for Guess the Festival and Gau Khane Katha.
- `lib/routing/app_router.dart` – central route configuration and transitions.

## Next Steps

1. Fill the festival quiz flow (question engine, streaks, fact panels).
2. Bring Gau Khane Katha riddles with Nepali/English toggles and progress tracking.
3. Hook up persistence (local first) and analytics, then prepare for app store assets.
