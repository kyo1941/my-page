package my.backend.plugins

import io.ktor.server.application.*
import io.ktor.server.routing.*
import my.backend.routes.blogRoutes
import my.backend.routes.contactRoutes
import my.backend.service.BlogService
import my.backend.service.ContactService
import org.koin.ktor.ext.inject

fun Application.configureRouting() {
    // Koinからサービスを注入
    val blogService by inject<BlogService>()
    val contactService by inject<ContactService>()

    routing {
        blogRoutes(blogService)
        contactRoutes(contactService)
    }
}
