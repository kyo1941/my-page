package my.backend.controller

import my.backend.dto.ApiResponse
import my.backend.dto.ContactFormRequest
import my.backend.service.ContactService
import my.backend.validation.hasValidationErrors
import my.backend.validation.validateContactForm
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

// --- Controller ---
@RestController
@RequestMapping("/api")
class ContactController(private val contactService: ContactService) {

    private val logger = LoggerFactory.getLogger(ContactController::class.java)

    @PostMapping("/contact")
    fun submitContactForm(@RequestBody request: ContactFormRequest): ResponseEntity<ApiResponse> {
        // 1. Server-side validation
        val validationErrors = validateContactForm(request.email, request.subject, request.message)
        if (hasValidationErrors(validationErrors)) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse(error = "Invalid input", details = validationErrors))
        }

        // 2. Delegate to service
        return try {
            contactService.processContactRequest(request)
            ResponseEntity.ok(ApiResponse(message = "メール送信が完了しました"))
        } catch (e: Exception) {
            logger.error("An unexpected error occurred while processing contact form: ", e)
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse(error = "メールの送信中に予期せぬエラーが発生しました。"))
        }
    }
}
