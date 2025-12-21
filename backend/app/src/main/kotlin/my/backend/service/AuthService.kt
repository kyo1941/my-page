package my.backend.service

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import io.ktor.server.config.*
import my.backend.repository.UserRepository
import org.mindrot.jbcrypt.BCrypt
import java.util.*

class AuthService(
    private val userRepository: UserRepository,
    private val config: ApplicationConfig
) {
    suspend fun authenticate(username: String, password: String): String? {
        val user = userRepository.findByUsername(username)
        if (user == null) {
            return null
        }

        if (BCrypt.checkpw(password, user.passwordHash)) {
            return generateToken(user.username)
        }

        return null
    }

    private fun generateToken(username: String): String {
        val secret = config.property("jwt.secret").getString()
        val issuer = config.property("jwt.issuer").getString()
        val audience = config.property("jwt.audience").getString()

        return JWT.create()
            .withAudience(audience)
            .withIssuer(issuer)
            .withClaim("username", username)
            .withExpiresAt(Date(System.currentTimeMillis() + 3600000)) // 1 hour
            .sign(Algorithm.HMAC256(secret))
    }
}

