package my.backend.controller

import my.backend.dto.BlogDto
import my.backend.service.BlogService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/blogs")
class BlogController(private val blogService: BlogService) {
    @GetMapping
    fun getAllBlogs(): List<BlogDto> {
        return blogService.getAllBlogs()
    }

    @GetMapping("/{slug}")
    fun getBlogBySlug(@PathVariable slug: String): BlogDto? {
        return blogService.getBlogBySlug(slug)
    }
}
