// Plugin versions live in settings.gradle.kts.

tasks.register<Delete>("clean") {
    delete(rootProject.layout.buildDirectory)
}
