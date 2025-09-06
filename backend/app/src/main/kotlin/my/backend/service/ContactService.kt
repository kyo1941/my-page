package my.backend.service

import com.resend.Resend
import com.resend.services.emails.model.SendEmailRequest
import my.backend.dto.ContactFormRequest
import my.backend.dto.TurnstileResponse
import org.apache.commons.text.StringEscapeUtils
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono

// --- Service ---
@Service
class ContactService(private val webClientBuilder: WebClient.Builder) {

    @Value("\${turnstile.secret-key}") private lateinit var turnstileSecretKey: String

    @Value("\${contact.recipient-email}") private lateinit var recipientEmail: String

    @Value("\${resend.api-key}") private lateinit var resendApiKey: String
    private val logger = LoggerFactory.getLogger(ContactService::class.java)

    fun processContactRequest(request: ContactFormRequest) {
        // 2a. Turnstile verification
        try {
            verifyTurnstile(request.turnstileToken).block()?.let {
                if (!it.success) {
                    logger.warn("Turnstile verification failed: ${it.errorCodes}")
                    throw IllegalStateException("Turnstile verification failed")
                }
            }
        } catch (e: Exception) {
            logger.error("Turnstile verification error", e)
            throw e
        }

        // 2b. Send email
        try {
            sendEmail(request)
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
        } catch (e: Exception) {
            logger.error("Failed to send email", e)
            throw RuntimeException("Failed to send email: ", e)
        }
    }
}
