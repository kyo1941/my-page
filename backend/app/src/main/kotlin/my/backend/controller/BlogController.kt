package my.backend.controller

import my.backend.dto.BlogDto
import my.backend.service.BlogService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestParam

@RestController
@RequestMapping("/api/blogs")
class BlogController(private val blogService: BlogService) {
    @GetMapping
    fun getAllBlogs(@RequestParam(required = false) limit: Int?): List<BlogDto> {
        return blogService.getBlogs(limit)
    }

    @GetMapping("/{slug}")
    fun getBlogBySlug(@PathVariable slug: String): BlogDto? {
        return blogService.getBlogBySlug(slug)
    }
}
