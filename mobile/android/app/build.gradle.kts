plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("dev.flutter.flutter-gradle-plugin")
}

android {
    namespace = "com.piro_momo_games"
    compileSdk = flutter.compileSdkVersion
    ndkVersion = "27.0.12077973"

    defaultConfig {
        applicationId = "com.piro_momo_games"
        minSdk = 23
        targetSdk = flutter.targetSdkVersion
        versionCode = 30
        versionName = "1.0.3"
        multiDexEnabled = true
    }

    signingConfigs {
        val keystoreFile = file("../upload-keystore.jks")
        if (keystoreFile.exists()) {
            create("release") {
                storeFile = keystoreFile
                storePassword = "ironmaiden"
                keyAlias = "upload"
                keyPassword = "ironmaiden"
            }
        }
    }

    buildTypes {
        getByName("release") {
            val keystoreFile = file("../upload-keystore.jks")
            if (keystoreFile.exists() && signingConfigs.findByName("release") != null) {
                signingConfig = signingConfigs.getByName("release")
            }
            isMinifyEnabled = false
            isShrinkResources = false
        }
        getByName("debug") {
            // default debug config
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
    implementation(platform("com.google.firebase:firebase-bom:34.6.0"))
    implementation("com.google.firebase:firebase-analytics")
}

apply(plugin = "com.google.gms.google-services")

// Ensure Google Services resources are generated before deep link extraction tasks run.
tasks.matching { it.name.startsWith("extractDeepLinks") }.configureEach {
    mustRunAfter(tasks.matching { task -> task.name.contains("GoogleServices") })
}
