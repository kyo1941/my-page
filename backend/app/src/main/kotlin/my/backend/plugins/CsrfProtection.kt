package my.backend.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import my.backend.dto.ApiResponse

private val MUTATING_METHODS = setOf(HttpMethod.Post, HttpMethod.Put, HttpMethod.Delete, HttpMethod.Patch)

private val CsrfProtection =
    createApplicationPlugin("CsrfProtection") {
        val configValue =
            application.environment.config
                .property("app.cors.allowed-origins")
                .getString()

        val allowedOrigins = configValue.split(",").map { it.trim().trimEnd('/') }

        onCall { call ->
            if (call.request.httpMethod in MUTATING_METHODS) {
                val origin = call.request.headers[HttpHeaders.Origin]
                if (origin == null || origin.trimEnd('/') !in allowedOrigins) {
                    call.respond(
                        HttpStatusCode.Forbidden,
                        ApiResponse(error = "不正なオリジンからのリクエストは許可されていません。"),
                    )
                }
            }
        }
    }

fun Application.configureCsrfProtection() {
    install(CsrfProtection)
}
