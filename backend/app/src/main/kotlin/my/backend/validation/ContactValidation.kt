package my.backend.validation

import my.backend.dto.ValidationErrors

// --- Validation Logic ---
fun validateContactForm(email: String, subject: String, message: String): ValidationErrors {
    val emailError =
            if (email.isBlank() || !email.matches("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$".toRegex())
            ) {
                "有効なメールアドレスを入力してください。"
            } else null

    val subjectError = if (subject.isBlank()) "件名を入力してください。" else null
    val messageError = if (message.isBlank()) "メッセージを入力してください。" else null

    return ValidationErrors(email = emailError, subject = subjectError, message = messageError)
}

fun ValidationErrors.hasErrors(): Boolean {
    return email != null || subject != null || message != null
}
