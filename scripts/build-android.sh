#!/usr/bin/env bash
set -euo pipefail

# Build helper for Piro Momo Flutter app
# Generates both release APK and App Bundle artifacts.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_DIR="$ROOT_DIR/piro_momo_games"
KEY_PROPS="$APP_DIR/android/key.properties"

if [[ ! -d "$APP_DIR" ]]; then
  echo "[build-android] Could not find Flutter app directory at $APP_DIR" >&2
  exit 1
fi

if ! command -v flutter >/dev/null 2>&1; then
  echo "[build-android] Flutter is not on PATH. Activate your Flutter SDK first." >&2
  exit 1
fi

if [[ ! -f "$KEY_PROPS" ]]; then
  cat >&2 <<WARN
[build-android] Warning: $KEY_PROPS is missing.
Release builds will be unsigned. Add your keystore + key.properties to sign the app.
WARN
fi

pushd "$APP_DIR" >/dev/null

flutter pub get

flutter build apk --release "$@"
flutter build appbundle --release "$@"

popd >/dev/null

echo "[build-android] Artifacts ready:"
echo "  APK : $APP_DIR/build/app/outputs/flutter-apk/app-release.apk"
echo "  AAB : $APP_DIR/build/app/outputs/bundle/release/app-release.aab"
