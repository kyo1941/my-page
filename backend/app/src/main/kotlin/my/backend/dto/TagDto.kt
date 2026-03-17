package my.backend.dto

import kotlinx.serialization.Serializable

@Serializable
data class TagResponseDto(val id: Int, val name: String)

@Serializable
data class TagRequestDto(val name: String)
