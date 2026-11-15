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

## Java Requirements for Android/Gradle

The Android Gradle Plugin (8.7.x) now runs only on JDK 17+. If you see Gradle fail with `Dependency requires at least JVM runtime version 11` (or similar), switch your Java runtime before invoking `flutter run`/`gradlew`:

1. Install a JDK 17 distribution (e.g. `brew install temurin@17`, `sdk install java 17.0.11-tem`, or `asdf install java temurin-17.0.11`).
2. Point `JAVA_HOME` at that install: macOS `export JAVA_HOME=$(/usr/libexec/java_home -v 17)`, Linux `export JAVA_HOME=/usr/lib/jvm/temurin-17`.
3. Re-run your build (`flutter run`, `./gradlew assembleDebug`, etc.).

For developers using `jenv`/`asdf`, the repo now contains a `.java-version` file set to `17` so the correct JDK is selected automatically when you `cd` into `piro_momo_games/`.

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

## Releasing to Google Play

1. **Toolchain:** use a current stable Flutter (`flutter upgrade`) and JDK 17. The app targets Android 16 (API 36), which Google Play requires for new apps and updates since 31 August 2026.
2. **Version:** raise `version:` in `pubspec.yaml` (e.g. `1.0.4+31`). The number after `+` is the versionCode and must be higher than every build you have uploaded before.
3. **Signing:** copy `android/key.properties.example` to `android/key.properties` and fill in your upload key. Both `key.properties` and the `.jks` file are git-ignored; never commit them. Without `key.properties` the release build is unsigned and Play rejects it.
4. **Build:** `flutter pub get && flutter build appbundle --release`, then upload `build/app/outputs/bundle/release/app-release.aab`.
5. **Google sign-in:** add the SHA-1 and SHA-256 of the *App signing key* (Play Console → Test and release → App integrity) to the Android app in Firebase, or Google sign-in fails for people who install from Play.
6. **Play Console listing:**
   - Privacy policy URL: `https://piromomo.com/en/privacy`
   - Data safety: account info (email, name, photo, user ID) and app activity (game progress) are collected for account management and app functionality, encrypted in transit, and users can request deletion. No ads, no analytics, nothing shared or sold.
   - Account deletion URL: `https://piromomo.com/en/delete-account` (users can also delete in the app: Profile → Delete account).
   - Target audience: 13 and over (the app is not made for children). Ads: none.
   - App access: the games need no login; sign-in is optional.

