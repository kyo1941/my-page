package my.backend.controller

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
