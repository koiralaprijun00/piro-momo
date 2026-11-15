import java.util.Properties

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("dev.flutter.flutter-gradle-plugin")
    id("com.google.gms.google-services")
}

// Release signing comes from android/key.properties, which is never committed
// (see android/.gitignore). Example key.properties:
//   storeFile=../upload-keystore.jks
//   storePassword=...
//   keyAlias=upload
//   keyPassword=...
val keystoreProperties = Properties().apply {
    val file = rootProject.file("key.properties")
    if (file.exists()) file.inputStream().use { load(it) }
}
val hasReleaseKey = keystoreProperties.getProperty("storeFile") != null

android {
    namespace = "com.piro_momo_games"
    // Google Play requires new apps and updates to target Android 16 (API 36)
    // from 31 August 2026.
    compileSdk = 36
    ndkVersion = "27.0.12077973"

    defaultConfig {
        // Must never change: it is the app's identity on Google Play.
        applicationId = "com.piro_momo_games"
        minSdk = 23
        targetSdk = 36
        // Version name and code come from `version:` in pubspec.yaml (e.g. 1.0.4+31).
        versionCode = flutter.versionCode
        versionName = flutter.versionName
        multiDexEnabled = true
    }

    signingConfigs {
        if (hasReleaseKey) {
            create("release") {
                storeFile = file(keystoreProperties.getProperty("storeFile"))
                storePassword = keystoreProperties.getProperty("storePassword")
                keyAlias = keystoreProperties.getProperty("keyAlias")
                keyPassword = keystoreProperties.getProperty("keyPassword")
            }
        }
    }

    buildTypes {
        getByName("release") {
            if (hasReleaseKey) {
                signingConfig = signingConfigs.getByName("release")
            } else {
                logger.warn(
                    "android/key.properties not found: the release build is NOT signed " +
                        "and Google Play will refuse it. See android/key.properties.example."
                )
            }
            isMinifyEnabled = false
            isShrinkResources = false
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

flutter {
    source = "../.."
}

dependencies {
    implementation("androidx.multidex:multidex:2.0.1")
    // Firebase libraries come from the FlutterFire plugins in pubspec.yaml. Don't add a
    // separate Firebase BoM here: a newer BoM silently upgrades the native SDKs under
    // the plugins and can crash at runtime.
}

// Ensure Google Services resources are generated before deep link extraction tasks run.
tasks.matching { it.name.startsWith("extractDeepLinks") }.configureEach {
    mustRunAfter(tasks.matching { task -> task.name.contains("GoogleServices") })
}
