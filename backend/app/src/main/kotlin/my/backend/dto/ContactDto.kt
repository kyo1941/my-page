package my.backend.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class ContactFormRequest(
        @field:NotBlank(message = "メールアドレスは必須です")
        @field:Email(message = "有効なメールアドレスを入力してください")
        val email: String,
        @field:NotBlank(message = "件名は必須です")
        @field:Size(min = 3, message = "件名は3文字以上で入力してください")
        val subject: String,
        @field:NotBlank(message = "メッセージは必須です")
        @field:Size(min = 10, message = "メッセージは10文字以上で入力してください")
        val message: String,
        @field:NotBlank val turnstileToken: String
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
