package my.backend.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import my.backend.service.AuthService

@Serializable
data class LoginRequest(val username: String, val password: String)

fun Route.authRoutes(authService: AuthService) {
    route("/api/auth") {
        post("/login") {
            try {
                val loginRequest = call.receive<LoginRequest>()
                val token = authService.authenticate(loginRequest.username, loginRequest.password)

                if (token != null) {
                    call.respond(HttpStatusCode.OK, mapOf("token" to token))
                } else {
                    call.respond(HttpStatusCode.Unauthorized, "Invalid credentials")
                }
            } catch (e: Exception) {
                call.application.log.error("Failed to process login", e)
                call.respond(HttpStatusCode.InternalServerError, "Internal Server Error")
            }
        }
    }
}
