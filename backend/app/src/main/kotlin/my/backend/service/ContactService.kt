package my.backend.service

import com.resend.Resend
import com.resend.services.emails.model.SendEmailRequest
import my.backend.dto.ContactFormRequest
import my.backend.dto.TurnstileResponse
import my.backend.exception.TurnstileVerificationException
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
class ContactService(
        private val webClientBuilder: WebClient.Builder,
        @Value("\${turnstile.secret-key}") private val turnstileSecretKey: String,
        @Value("\${contact.recipient-email}") private val recipientEmail: String,
        @Value("\${resend.api-key}") private val resendApiKey: String,
        @Value("\${resend.from-email}") private val fromEmail: String
) {
    private val logger = LoggerFactory.getLogger(ContactService::class.java)

    private val webClient: WebClient = webClientBuilder.build()

    private val resend: Resend by lazy { Resend(resendApiKey) }

    fun processContactRequest(request: ContactFormRequest) {
        // Turnstile verification
        val turnstileResponse = verifyTurnstile(request.turnstileToken).block()

        // Check verification result
        if (turnstileResponse == null || !turnstileResponse.success) {
            val errorCodes =
                    turnstileResponse?.errorCodes ?: listOf("No response from verification service")
            logger.warn("Turnstile verification failed: $errorCodes")
            throw TurnstileVerificationException("Turnstile verification failed")
        }
        logger.info(
                "Turnstile response received: success=${turnstileResponse.success}, errorCodes=${turnstileResponse.errorCodes}"
        )

        // Send email
        sendEmail(request)
    }

    private fun verifyTurnstile(token: String): Mono<TurnstileResponse> {
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
                        .from(fromEmail)
                        .to(recipientEmail)
                        .subject("[お問い合わせ] ${request.subject}")
                        .replyTo(request.email)
                        .html(emailHtml)
                        .build()

        resend.emails().send(sendEmailRequest)
    }
}
