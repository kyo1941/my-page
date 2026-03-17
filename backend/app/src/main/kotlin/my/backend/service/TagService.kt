package my.backend.service

import my.backend.dto.TagResponseDto
import my.backend.exception.DuplicateTagException
import my.backend.repository.TagRepository

class TagService(private val tagRepository: TagRepository) {
    suspend fun getTags(): List<TagResponseDto> = tagRepository.findAll()

    suspend fun createTag(name: String): TagResponseDto {
        if (tagRepository.existsByName(name)) throw DuplicateTagException(name)
        return tagRepository.create(name)
    }

    suspend fun updateTag(
        id: Int,
        name: String,
    ): TagResponseDto? {
        if (tagRepository.existsByName(name, excludeId = id)) throw DuplicateTagException(name)
        return tagRepository.update(id, name)
    }

    suspend fun deleteTag(id: Int): Boolean = tagRepository.delete(id)
}
