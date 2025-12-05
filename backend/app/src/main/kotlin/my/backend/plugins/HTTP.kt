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

        allowedOrigins.split(",")
            .map { it.trim() }
            .mapNotNull { origin ->
                runCatching { URI(origin) }.getOrNull()
            }
            .forEach { uri ->
                val host = uri.host ?: return@forEach
                val scheme = uri.scheme ?: return@forEach

                val hostPattern = buildString {
                    append(host)
                    if (uri.port != -1) append(":${uri.port}")
                }

                allowHost(hostPattern, schemes = listOf(scheme))
            }
    }
}
