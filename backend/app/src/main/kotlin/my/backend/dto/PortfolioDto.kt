package my.backend.dto

import kotlinx.serialization.Serializable

@Serializable
data class PortfolioDto(
    val slug: String,
    val title: String,
    val date: String,
    val description: String,
    val coverImage: String? = null,
    val tags: List<String>,
    val content: String,
)
