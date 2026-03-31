package my.backend.dto

import kotlinx.serialization.Serializable

@Serializable
data class OgpResponseDto(
    val url: String,
    val title: String? = null,
    val description: String? = null,
    val image: String? = null,
    val siteName: String? = null,
    val favicon: String? = null,
)
