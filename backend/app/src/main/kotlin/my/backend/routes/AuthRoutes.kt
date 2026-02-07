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

@Serializable
data class LoginResponse(val token: String)

fun Route.authRoutes(authService: AuthService) {
    route("/api/auth") {
        post("/login") {
            try {
                val loginRequest = call.receive<LoginRequest>()
                val token = authService.authenticate(loginRequest.username, loginRequest.password)

                if (token != null) {
                    call.response.cookies.append(
                        Cookie(
                            name = "auth_token",
                            value = token,
                            httpOnly = true,
                            // TODO: Set to true in production
                            secure = false,
                            path = "/",
                            maxAge = 3600,
                        ),
                    )
                    call.respond(HttpStatusCode.OK)
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
