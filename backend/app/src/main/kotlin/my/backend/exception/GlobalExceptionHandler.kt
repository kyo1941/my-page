package my.backend.exception

import com.resend.core.exception.ResendException
import my.backend.dto.ApiResponse
import my.backend.dto.ValidationErrors
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException 
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class GlobalExceptionHandler {

    private val logger = LoggerFactory.getLogger(javaClass)

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationExceptions(
            ex: MethodArgumentNotValidException
    ): ResponseEntity<ApiResponse> {
        val errors = ex.bindingResult.fieldErrors.associate { it.field to it.defaultMessage }
        val validationErrors =
                ValidationErrors(
                        email = errors["email"],
                        subject = errors["subject"],
                        message = errors["message"]
                )
        logger.warn("Validation failed: $errors")
        return ResponseEntity.badRequest()
                .body(ApiResponse(error = "入力値が無効です。", details = validationErrors))
    }

    @ExceptionHandler(TurnstileVerificationException::class)
    fun handleTurnstileVerificationException(
            e: TurnstileVerificationException
    ): ResponseEntity<ApiResponse> {
        logger.error("Turnstile verification failed: ", e)
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse(error = "認証に失敗しました。ページを再読み込みして、もう一度お試しください。"))
    }

    @ExceptionHandler(ResendException::class)
    fun handleResendException(e: ResendException): ResponseEntity<ApiResponse> {
        logger.error("Email sending failed: ", e)
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse(error = "メール送信サービスで一時的な問題が発生しました。"))
    }

    @ExceptionHandler(Exception::class)
    fun handleGenericException(e: Exception): ResponseEntity<ApiResponse> {
        logger.error("An unexpected error occurred: ", e)
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse(error = "サーバーに予期せぬエラーが発生しました。"))
    }
}
