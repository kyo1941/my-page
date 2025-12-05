package my.backend.plugins

import io.ktor.server.application.*
import io.ktor.server.plugins.requestvalidation.*
import my.backend.dto.ContactFormRequest

fun Application.configureValidation() {
    install(RequestValidation) {
        validate<ContactFormRequest> { request ->
            val errors = mutableListOf<String>()

            // メールアドレスのバリデーション
            if (request.email.isBlank()) {
                errors.add("email:メールアドレスは必須です")
            } else if (!request.email.matches(Regex("^[A-Za-z0-9+_.-]+@([A-Za-z0-9-]+\\.)+[A-Za-z]{2,6}$"))) {
                errors.add("email:有効なメールアドレスを入力してください")
            }

            // 件名のバリデーション
            if (request.subject.isBlank()) {
                errors.add("subject:件名は必須です")
            } else if (request.subject.length < 3) {
                errors.add("subject:件名は3文字以上で入力してください")
            }

            // メッセージのバリデーション
            if (request.message.isBlank()) {
                errors.add("message:メッセージは必須です")
            } else if (request.message.length < 10) {
                errors.add("message:メッセージは10文字以上で入力してください")
            }

            // Turnstileトークンのバリデーション
            if (request.turnstileToken.isBlank()) {
                errors.add("turnstileToken:認証トークンは必須です")
            }

            if (errors.isEmpty()) {
                ValidationResult.Valid
            } else {
                ValidationResult.Invalid(errors)
            }
        }
    }
}
