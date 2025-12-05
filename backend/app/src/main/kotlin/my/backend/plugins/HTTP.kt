package my.backend.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.*
import java.net.URI

fun Application.configureHTTP() {
    val allowedOrigins =
        environment.config.propertyOrNull("app.cors.allowed-origins")?.getString()
            ?: "http://localhost:3000"

    install(CORS) {
        allowMethod(HttpMethod.Options)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Get)
        allowHeader(HttpHeaders.ContentType)
        allowCredentials = true

        allowedOrigins.split(",").forEach { origin ->
            val uri = URI(origin.trim())
            val host = uri.host
            val scheme = uri.scheme

            if (host != null && scheme != null) {
                allowHost(host, schemes = listOf(scheme))
            }
        }
    }
}
