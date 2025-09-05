package my.backend.dto

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
