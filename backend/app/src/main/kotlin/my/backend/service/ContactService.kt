package my.backend.service

import com.resend.Resend
import com.resend.services.emails.model.SendEmailRequest
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.forms.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.config.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import my.backend.dto.ContactFormRequest
import my.backend.dto.TurnstileResponse
import my.backend.exception.TurnstileVerificationException
import org.apache.commons.text.StringEscapeUtils
import org.slf4j.LoggerFactory

class ContactService(
    private val config: ApplicationConfig,
    private val client: HttpClient,
    private val resend: Resend,
) {
    private val logger = LoggerFactory.getLogger(ContactService::class.java)

    private val turnstileSecretKey = config.property("app.turnstile.secret-key").getString()
    private val recipientEmail = config.property("app.contact.recipient-email").getString()
    private val resendApiKey = config.property("app.resend.api-key").getString()
    private val fromEmail = config.property("app.resend.from-email").getString()

    suspend fun processContactRequest(request: ContactFormRequest) {
        val turnstileResponse = verifyTurnstile(request.turnstileToken)

        if (turnstileResponse.success) {
            logger.info("Turnstile verification succeeded")
            sendEmail(request)
        } else {
            logger.warn(
                "Turnstile verification failed: ${turnstileResponse.errorCodes}",
            )
            throw TurnstileVerificationException("Turnstile verification failed")
        }
    }

    private suspend fun verifyTurnstile(token: String): TurnstileResponse {
        return client.submitForm(
            url = "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            formParameters =
                parameters {
                    append("secret", turnstileSecretKey)
                    append("response", token)
                },
        )
            .body()
    }

    private suspend fun sendEmail(request: ContactFormRequest) {
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

        withContext(Dispatchers.IO) { resend.emails().send(sendEmailRequest) }
    }
}
