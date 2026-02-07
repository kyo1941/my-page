package my.backend.plugins

import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.routing.*
import my.backend.routes.authRoutes
import my.backend.routes.blogRoutes
import my.backend.routes.contactRoutes
import my.backend.routes.portfolioRoutes
import my.backend.service.AuthService
import my.backend.service.BlogService
import my.backend.service.ContactService
import my.backend.service.PortfolioService
import org.koin.ktor.ext.inject

fun Application.configureRouting() {
    val blogService by inject<BlogService>()
    val contactService by inject<ContactService>()
    val portfolioService by inject<PortfolioService>()
    val authService by inject<AuthService>()

    routing {
        blogRoutes(blogService)
        contactRoutes(contactService)
        portfolioRoutes(portfolioService)
        authRoutes(authService)

        staticResources("/images", "static/images")
    }
}
