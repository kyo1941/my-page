package my.backend.plugins

import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import kotlinx.serialization.json.Json

fun Application.configureSerialization() {
    val isDevelopment = environment.developmentMode

    install(ContentNegotiation) {
        json(
            Json {
                prettyPrint = isDevelopment
                isLenient = true
                ignoreUnknownKeys = true
            },
        )
    }
}
