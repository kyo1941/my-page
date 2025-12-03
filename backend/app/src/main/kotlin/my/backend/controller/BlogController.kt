package my.backend.controller

import my.backend.dto.BlogDto
import my.backend.service.BlogService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.http.ResponseEntity

@RestController
@RequestMapping("/api/blogs")
class BlogController(private val blogService: BlogService) {
    @GetMapping
    fun getAllBlogs(
        @RequestParam(required = false) limit: Int?,
        @RequestParam(required = false) tags: List<String>?,
        @RequestParam(required = false) keyword: String?
    ): ResponseEntity<List<BlogDto>> {
        return ResponseEntity.ok(blogService.getBlogs(limit, tags, keyword))
    }

    @GetMapping("/{slug}")
    fun getBlogBySlug(@PathVariable slug: String): ResponseEntity<BlogDto> {
        val blog = blogService.getBlogBySlug(slug) ?: return ResponseEntity.notFound().build()
        return ResponseEntity.ok(blog)
    }
}
