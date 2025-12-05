package my.backend.plugins

import io.ktor.server.application.*
import io.ktor.server.routing.*
import my.backend.routes.blogRoutes
import my.backend.routes.contactRoutes
import my.backend.service.BlogService
import my.backend.service.ContactService

fun Application.configureRouting() {
    val blogService = BlogService()
    val contactService = ContactService(environment.config)

    routing {
        blogRoutes(blogService)
        contactRoutes(contactService)
    }
}
