package my.backend.service

import my.backend.dto.BlogRequestDto
import my.backend.dto.BlogResponseDto
import my.backend.repository.BlogRepository

class BlogService(private val blogRepository: BlogRepository) {
    companion object {
        const val MAX_LIMIT = 100
    }

    suspend fun getBlogs(
        limit: Int = MAX_LIMIT,
        tags: List<String>? = null,
        keyword: String? = null,
    ): List<BlogResponseDto> {
        if (limit > MAX_LIMIT) {
            throw IllegalArgumentException("limit の最大値は $MAX_LIMIT です。")
        }
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
