import org.gradle.api.Plugin
import org.gradle.api.Project

class GoogleServicesPlugin : Plugin<Project> {
    override fun apply(project: Project) {
        project.afterEvaluate {
            project.pluginManager.apply("com.google.gms.google-services")
        }
    }
}
