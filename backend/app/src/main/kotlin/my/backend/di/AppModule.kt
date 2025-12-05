package my.backend.di

import com.resend.Resend
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.config.*
import kotlinx.serialization.json.Json
import my.backend.service.BlogService
import my.backend.service.ContactService
import my.backend.service.PortfolioService
import org.koin.dsl.module
import org.koin.dsl.onClose

fun appModule(config: ApplicationConfig) =
    module {
        // Config
        single { config }

        // HttpClient (Turnstile API用)
        single {
            HttpClient(CIO) { install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) } }
        } onClose { it?.close() }

        // Resend (メール送信用)
        single { Resend(config.property("app.resend.api-key").getString()) }

        // Services
        single { BlogService() }
        single { ContactService(get(), get(), get()) }
        single { PortfolioService() }
    }
