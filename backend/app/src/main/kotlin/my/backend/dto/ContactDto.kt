package my.backend.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class ContactFormRequest(
    val email: String,
    val subject: String,
    val message: String,
    val turnstileToken: String
)

@Serializable
data class ValidationErrors(
    val email: String? = null,
    val subject: String? = null,
    val message: String? = null
)

@Serializable
data class TurnstileResponse(
    val success: Boolean,
    @SerialName("error-codes")
    val errorCodes: List<String> = emptyList()
)

@Serializable
data class ApiResponse(
    val message: String? = null,
    val error: String? = null,
    val details: ValidationErrors? = null
)
