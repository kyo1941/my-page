package my.backend.service

import com.vladsch.flexmark.ext.autolink.AutolinkExtension
import com.vladsch.flexmark.ext.gfm.strikethrough.StrikethroughExtension
import com.vladsch.flexmark.ext.tables.TablesExtension
import com.vladsch.flexmark.html.HtmlRenderer
import com.vladsch.flexmark.parser.Parser
import com.vladsch.flexmark.util.data.MutableDataSet
import my.backend.dto.BlogDto
import org.springframework.core.io.support.ResourcePatternResolver
import org.springframework.stereotype.Service
import java.nio.charset.StandardCharsets
import java.util.Arrays

@Service
class BlogService(private val resourceResolver: ResourcePatternResolver) {

    private val blogsDirectory = "classpath:blogs/*.md"
    private val parser: Parser
    private val renderer: HtmlRenderer

    init {
        val options = MutableDataSet()
        options.set(
            Parser.EXTENSIONS,
            listOf(
                TablesExtension.create(),
                StrikethroughExtension.create(),
                AutolinkExtension.create(),
            )
        )
        parser = Parser.builder(options).build()
        renderer = HtmlRenderer.builder(options).build()
    }

    fun getAllBlogs(): List<BlogDto> {
        val resources = resourceResolver.getResources(blogsDirectory)
        return resources.map { resource ->
            val content = resource.inputStream.readBytes().toString(StandardCharsets.UTF_8)
            val parts = content.split("---", limit = 3)
            val frontMatter = parts.getOrNull(1) ?: ""
            val markdownBody = parts.getOrNull(2) ?: ""

            val meta = frontMatter.lines()
                .filter { it.contains(":") }
                .associate {
                    val part = it.split(":", limit = 2)
                    part[0].trim() to part[1].trim()
                }

            val tags = frontMatter.lines()
                .map { it.trim() }
                .filter { it.startsWith("-") }
                .map { it.removePrefix("-").trim() }

            val contentHtml = renderer.render(parser.parse(markdownBody))

            BlogDto(
                slug = resource.filename?.replace(".md", "") ?: "",
                title = meta["title"] ?: "",
                date = meta["date"] ?: "",
                description = meta["description"] ?: "",
                coverImage = meta["coverImage"]?.removeSurrounding("'"),
                tags = tags,
                content = contentHtml
            )
        }.sortedByDescending { it.date }
    }

    fun getBlogBySlug(slug: String): BlogDto? {
        return getAllBlogs().find { it.slug == slug }
    }
}
