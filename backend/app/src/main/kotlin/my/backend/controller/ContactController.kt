package my.backend.controller

import my.backend.dto.ApiResponse
import my.backend.dto.ContactFormRequest
import my.backend.service.ContactService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
class ContactController(private val contactService: ContactService) {

    @PostMapping("/contact")
    fun submitContactForm(@RequestBody request: ContactFormRequest): ResponseEntity<ApiResponse> {
        contactService.processContactRequest(request).block()
        return ResponseEntity.ok(ApiResponse(message = "メール送信が完了しました"))
    }
}
