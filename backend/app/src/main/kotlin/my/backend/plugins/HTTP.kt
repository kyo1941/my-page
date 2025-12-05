package my.backend.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.*

fun Application.configureHTTP() {
    val allowedOrigins = environment.config.propertyOrNull("app.cors.allowed-origins")?.getString()
        ?: "http://localhost:3000"

    install(CORS) {
        allowMethod(HttpMethod.Options)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Get)
        allowHeader(HttpHeaders.ContentType)
        allowCredentials = true

        allowedOrigins.split(",").forEach { origin ->
            allowHost(origin.trim().removePrefix("http://").removePrefix("https://"), 
                schemes = listOf("http", "https"))
        }
    }
}
