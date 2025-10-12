package my.backend.dto

data class BlogDto(
    val slug: String,
    val title: String,
    val date: String,
    val description: String,
    val coverImage: String? = null,
    val tags: List<String>,
    val content: String
)

