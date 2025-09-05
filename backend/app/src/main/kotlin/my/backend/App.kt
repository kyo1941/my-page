package my.backend

import com.resend.Resend
import com.resend.services.emails.model.SendEmailRequest
import org.apache.commons.text.StringEscapeUtils
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.bind.annotation.*
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import reactor.core.publisher.Mono

// --- Data Classes ---
// Note: In Spring with Jackson, @Serializable is not needed.
data class ContactFormRequest(
        val email: String,
        val subject: String,
        val message: String,
        val turnstileToken: String
)

data class ValidationErrors(
        val email: String? = null,
        val subject: String? = null,
        val message: String? = null
)

data class TurnstileResponse(val success: Boolean, val errorCodes: List<String> = emptyList())

data class ApiResponse(
        val message: String? = null,
        val error: String? = null,
        val details: ValidationErrors? = null
)

// --- Main Application ---
@SpringBootApplication class Application

fun main(args: Array<String>) {
    runApplication<Application>(*args)
}

// --- CORS Configuration ---
@Configuration
class WebConfig : WebMvcConfigurer {

    @Value("\${cors.allowed-origins:http://localhost:3000}")
    private lateinit var allowedOrigins: String

    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/api/**")
                .allowedOrigins(allowedOrigins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
    }
}

// --- Controller ---
@RestController
@RequestMapping("/api")
class ContactController(private val contactService: ContactService) {

    private val logger = LoggerFactory.getLogger(ContactController::class.java)

    @PostMapping("/contact")
    fun submitContactForm(@RequestBody request: ContactFormRequest): ResponseEntity<ApiResponse> {
        // 1. Server-side validation
        val validationErrors = validateContactForm(request)
        if (hasValidationErrors(validationErrors)) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse(error = "Invalid input", details = validationErrors))
        }

        // 2. Delegate to service
        return try {
            contactService.processContactRequest(request)
            ResponseEntity.ok(ApiResponse(message = "メール送信が完了しました"))
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse(error = e.message ?: "Unknown error occurred"))
        }
    }
}

// --- Service ---
@Service
class ContactService(private val webClientBuilder: WebClient.Builder) {

    @Value("\${turnstile.secret-key}") private lateinit var turnstileSecretKey: String

    @Value("\${contact.recipient-email}") private lateinit var recipientEmail: String

    @Value("\${resend.api-key}") private lateinit var resendApiKey: String
    private val logger = LoggerFactory.getLogger(ContactService::class.java)

    fun processContactRequest(request: ContactFormRequest) {
        logger.info("=== Contact request received ===")
        logger.info("Email: ${request.email}")
        logger.info("Subject: ${request.subject}")
        logger.info("Message length: ${request.message.length}")
        logger.info("Turnstile token: ${request.turnstileToken}")

        // 2a. Turnstile verification
        logger.info("Starting Turnstile verification...")
        try {
            verifyTurnstile(request.turnstileToken).block()?.let {
                logger.info(
                        "Turnstile response received: success=${it.success}, errorCodes=${it.errorCodes}"
                )
                if (!it.success) {
                    logger.warn("Turnstile verification failed: ${it.errorCodes}")
                    throw IllegalStateException("Turnstile verification failed")
                }
            }
            logger.info("Turnstile verification passed")
        } catch (e: Exception) {
            logger.error("Turnstile verification error", e)
            throw e
        }

        // 2b. Send email
        logger.info("Starting email sending...")
        try {
            sendEmail(request)
            logger.info("Email sent successfully")
        } catch (e: Exception) {
            logger.error("Email sending error", e)
            throw e
        }
    }

    private fun verifyTurnstile(token: String): Mono<TurnstileResponse> {
        val webClient = webClientBuilder.build()
        val formData = LinkedMultiValueMap<String, String>()
        formData.add("secret", turnstileSecretKey)
        formData.add("response", token)

        return webClient
                .post()
                .uri("https://challenges.cloudflare.com/turnstile/v0/siteverify")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .bodyToMono(TurnstileResponse::class.java)
    }

    private fun sendEmail(request: ContactFormRequest) {
        val resend = Resend(resendApiKey)

        val emailHtml =
                """
            <h3>新しいお問い合わせ</h3>
            <p><strong>送信者:</strong> ${StringEscapeUtils.escapeHtml4(request.email)}</p>
            <p><strong>件名:</strong> ${StringEscapeUtils.escapeHtml4(request.subject)}</p>
            <p><strong>メッセージ:</strong></p>
                    <p>${StringEscapeUtils.escapeHtml4(request.message).replace("\n", "<br>")}</p>
        """.trimIndent()

        val sendEmailRequest =
                SendEmailRequest.builder()
                        .from(
                                "onboarding@resend.dev"
                        ) // Note: Must be a verified domain in production
                        .to(recipientEmail)
                        .subject("[お問い合わせ] ${request.subject}")
                        .replyTo(request.email)
                        .html(emailHtml)
                        .build()

        try {
            resend.emails().send(sendEmailRequest)
            logger.info("Email sent successfully to $recipientEmail")
        } catch (e: Exception) {
            logger.error("Failed to send email", e)
            throw RuntimeException("Failed to send email")
        }
    }
}

// --- Validation Logic (can be moved to a separate file) ---
fun validateContactForm(request: ContactFormRequest): ValidationErrors {
    val emailError =
            if (request.email.isBlank() ||
                            !request.email.matches("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$".toRegex())
            ) {
                "有効なメールアドレスを入力してください。"
            } else null

    val subjectError = if (request.subject.isBlank()) "件名を入力してください。" else null
    val messageError = if (request.message.isBlank()) "メッセージを入力してください。" else null

    return ValidationErrors(email = emailError, subject = subjectError, message = messageError)
}

fun hasValidationErrors(errors: ValidationErrors): Boolean {
    return errors.email != null || errors.subject != null || errors.message != null
}
