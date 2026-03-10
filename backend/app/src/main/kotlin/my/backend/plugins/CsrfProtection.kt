package my.backend.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import my.backend.exception.InvalidOriginException

private val MUTATING_METHODS = setOf(HttpMethod.Post, HttpMethod.Put, HttpMethod.Delete, HttpMethod.Patch)

private val CsrfProtection =
    createApplicationPlugin("CsrfProtection") {
        val configValue =
            application.environment.config
                .property("app.cors.allowed-origins")
                .getString()

        val allowedOrigins = configValue.split(",").map { it.trim().trimEnd('/') }.toSet()

        onCall { call ->
            if (call.request.httpMethod in MUTATING_METHODS) {
                val origin = call.request.headers[HttpHeaders.Origin]
                if (origin == null || origin.trimEnd('/') !in allowedOrigins) {
                    throw InvalidOriginException(
                        "Request from origin '${origin ?: "missing"}' is not allowed.",
                    )
                }
            }
        }
    }

fun Application.configureCsrfProtection() {
    install(CsrfProtection)
}
