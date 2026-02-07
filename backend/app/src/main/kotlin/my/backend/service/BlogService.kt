package my.backend.service

import my.backend.dto.BlogRequestDto
import my.backend.dto.BlogResponseDto
import my.backend.repository.BlogRepository

class BlogService(private val blogRepository: BlogRepository) {
    suspend fun getBlogs(
        limit: Int?,
        tags: List<String>?,
        keyword: String?,
    ): List<BlogResponseDto> {
        return blogRepository.findAll(limit, tags, keyword)
    }

    suspend fun getBlogBySlug(slug: String): BlogResponseDto? {
        return blogRepository.findBySlug(slug)
    }

    suspend fun createBlog(blog: BlogRequestDto): BlogResponseDto {
        return blogRepository.create(blog)
    }

    suspend fun updateBlog(
        slug: String,
        blog: BlogRequestDto,
    ): BlogResponseDto? {
        return blogRepository.update(slug, blog)
    }

    suspend fun deleteBlog(slug: String): Boolean {
        return blogRepository.delete(slug)
    }
}
