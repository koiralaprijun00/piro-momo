tasks.register<Delete>("clean") {
    delete(rootProject.layout.buildDirectory)
}

buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle:8.6.0")  // or whatever you already had
        classpath("com.google.gms:google-services:4.4.2")  // 👈 this is the important one
    }
}