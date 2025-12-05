package my.backend.plugins

import com.resend.core.exception.ResendException
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.requestvalidation.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import my.backend.dto.ApiResponse
import my.backend.dto.ValidationErrors
import my.backend.exception.TurnstileVerificationException
import org.slf4j.LoggerFactory

fun Application.configureStatusPages() {
    val logger = LoggerFactory.getLogger("StatusPages")

    install(StatusPages) {
        // バリデーションエラー
        exception<RequestValidationException> { call, cause ->
            val errors = cause.reasons
            val validationErrors =
                    ValidationErrors(
                            email = errors.find { it.contains("メールアドレス") || it.contains("email") },
                            subject = errors.find { it.contains("件名") || it.contains("subject") },
                            message = errors.find { it.contains("メッセージ") || it.contains("message") }
                    )
            logger.warn("Validation failed: $errors")
            call.respond(
                    HttpStatusCode.BadRequest,
                    ApiResponse(error = "入力値が無効です。", details = validationErrors)
            )
        }

        // Turnstile認証エラー
        exception<TurnstileVerificationException> { call, cause ->
            logger.error("Turnstile verification failed: ${cause.message}")
            call.respond(
                    HttpStatusCode.Forbidden,
                    ApiResponse(error = "認証に失敗しました。ページを再読み込みして、もう一度お試しください。")
            )
        }

        // Resendメール送信エラー
        exception<ResendException> { call, cause ->
            logger.error("Email sending failed: ${cause.message}")
            call.respond(
                    HttpStatusCode.InternalServerError,
                    ApiResponse(error = "メール送信サービスで一時的な問題が発生しました。")
            )
        }

        // その他のエラー
        exception<Throwable> { call, cause ->
            logger.error("An unexpected error occurred: ${cause.message}", cause)
            call.respond(
                    HttpStatusCode.InternalServerError,
                    ApiResponse(error = "サーバーに予期せぬエラーが発生しました。")
            )
        }
    }
}
