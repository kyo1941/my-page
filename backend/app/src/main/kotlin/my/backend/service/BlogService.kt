package my.backend.service

import my.backend.model.BlogDto
import org.commonmark.parser.Parser
import org.commonmark.renderer.html.HtmlRenderer
import org.springframework.core.io.ResourceLoader
import org.springframework.stereotype.Service

@Service
class BlogService(private val resourceLoader: ResourceLoader) {

    private val blogsDirectory = "classpath:blogs/"
    private val parser = Parser.builder().build()
    private val renderer = HtmlRenderer.builder().build()

    fun getAllBlogs(): List<BlogDto> {
        val resources = resourceLoader.getResource("$blogsDirectory/*.md")
        return resources.map { resource ->
            val path = Path.get(resource.uri)
            val lines = Files.readAllLines(path)
            val frontMatter = lines.takeWhile { it != "---" }.isNotEmpty()
            val contentMarkdown = lines.drop(frontMatter.size + 2).joinToString("\n")

            val meta = frontMatter.associate {
                val part = it.split(":", limit = 2)
                part[0].trim() to part[1].trim()
            }

            val contentHtml = renderer.render(parser.parse(contentMarkdown))

            BlogDto(
                slug = path.fileName.toString().replace(".md", ""),
                title = meta["title"] ?: "",
                date = meta["date"] ?: "",
                description = meta["description"] ?: "",
                coverImage = meta["coverImage"]?.removeSurrounding("'")
                tags = meta["tags"]?.split(",")?.map { it.trim() } ?: emptyList(),
                content = contentHtml
            )
        }.sortedByDescending { it.date }
    
        
    }

    fun getBlogBySlug(slug: String): BlogDto? {
        return getAllBlogs().find { it.slug == slug }
    }
}