package my.backend.controller

import my.backend.dto.ApiResponse
import my.backend.dto.ContactFormRequest
import my.backend.service.ContactService
import my.backend.validation.validateContactForm
import my.backend.validation.hasErrors
import my.backend.exception.TurnstileVerificationException
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import com.resend.core.exception.ResendException

// --- Controller ---
@RestController
@RequestMapping("/api")
class ContactController(private val contactService: ContactService) {

    private val logger = LoggerFactory.getLogger(ContactController::class.java)

    @PostMapping("/contact")
    fun submitContactForm(@RequestBody request: ContactFormRequest): ResponseEntity<ApiResponse> {
        // Server-side validation
        val validationErrors = validateContactForm(request.email, request.subject, request.message)
        if (validationErrors.hasErrors()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse(error = "Invalid input", details = validationErrors))
        }

        // Delegate to service
        try {
            contactService.processContactRequest(request)
            return ResponseEntity.ok(ApiResponse(message = "メール送信が完了しました"))
        } catch (e: TurnstileVerificationException) {
            logger.error("Turnstile verification failed: ", e)
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse(error = "認証に失敗しました。ページを再読み込みして、もう一度お試しください。"))
        } catch (e: ResendException) {
            logger.error("Email sending failed: ", e)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse(error = "メール送信サービスで一時的な問題が発生しました。"))
        } catch (e: Exception) {
            logger.error("An unexpected error occurred while processing contact form: ", e)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse(error = "サーバーに予期せぬエラーが発生しました。"))
        }
    }
}
