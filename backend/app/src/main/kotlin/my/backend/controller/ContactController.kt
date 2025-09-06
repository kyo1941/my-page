package my.backend.controller

import my.backend.dto.ApiResponse
import my.backend.dto.ContactFormRequest
import my.backend.service.ContactService
import my.backend.validation.hasErrors
import my.backend.validation.validateContactForm
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
class ContactController(private val contactService: ContactService) {

    @PostMapping("/contact")
    fun submitContactForm(@RequestBody request: ContactFormRequest): ResponseEntity<ApiResponse> {
        // Server-side validation
        val validationErrors = validateContactForm(request.email, request.subject, request.message)
        if (validationErrors.hasErrors()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse(error = "Invalid input", details = validationErrors))
        }

        // Delegate to service
        contactService.processContactRequest(request)
        return ResponseEntity.ok(ApiResponse(message = "メール送信が完了しました"))
    }
}
