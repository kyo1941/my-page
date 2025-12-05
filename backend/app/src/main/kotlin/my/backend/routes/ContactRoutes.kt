package my.backend.routes

import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import my.backend.dto.ApiResponse
import my.backend.dto.ContactFormRequest
import my.backend.service.ContactService

fun Route.contactRoutes(contactService: ContactService) {
    post("/api/contact") {
        val request = call.receive<ContactFormRequest>()
        contactService.processContactRequest(request)
        call.respond(ApiResponse(message = "メール送信が完了しました"))
    }
}
