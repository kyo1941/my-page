package my.backend.service

import my.backend.dto.BlogDto
import my.backend.repository.BlogRepository

class BlogService(private val blogRepository: BlogRepository) {
    suspend fun getBlogs(
        limit: Int?,
        tags: List<String>?,
        keyword: String?,
    ): List<BlogDto> {
        return blogRepository.findAll(limit, tags, keyword)
    }

    suspend fun getBlogBySlug(slug: String): BlogDto? {
        return blogRepository.findBySlug(slug)
    }

    suspend fun createBlog(blog: BlogDto): BlogDto {
        return blogRepository.create(blog)
    }

    suspend fun updateBlog(
        slug: String,
        blog: BlogDto,
    ): BlogDto? {
        return blogRepository.update(slug, blog)
    }

    suspend fun deleteBlog(slug: String): Boolean {
        return blogRepository.delete(slug)
    }
}
