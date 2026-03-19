package my.backend.dto

import kotlinx.serialization.Serializable

@Serializable
data class TagResponseDto(val id: Int, val name: String, val displayOrder: Int)

@Serializable
data class TagRequestDto(val name: String)

@Serializable
data class TagOrderItem(val id: Int, val displayOrder: Int)

@Serializable
data class TagReorderRequestDto(val orders: List<TagOrderItem>)
