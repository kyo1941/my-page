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
import org.yaml.snakeyaml.Yaml
import java.nio.charset.StandardCharsets
import java.util.Arrays

@Service
class BlogService(private val resourceResolver: ResourcePatternResolver) {

    private val blogsDirectory = "classpath:blogs/*.md"
    private val parser: Parser
    private val renderer: HtmlRenderer
    private val blogs: List<BlogDto>

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
        
        val yaml = Yaml()
        val resources = resourceResolver.getResources(blogsDirectory)
        blogs = resources.map { resource ->
            val content = resource.inputStream.readBytes().toString(StandardCharsets.UTF_8)
            val parts = content.split("---", limit = 3)
            val frontMatter = parts.getOrNull(1) ?: ""
            val markdownBody = parts.getOrNull(2) ?: ""

            val meta: Map<String, Any> = yaml.load(frontMatter) ?: emptyMap()

            val contentHtml = renderer.render(parser.parse(markdownBody))

            @Suppress("UNCHECKED_CAST")
            BlogDto(
                slug = resource.filename?.replace(".md", "") ?: "",
                title = meta["title"] as? String ?: "",
                date = meta["date"] as? String ?: "",
                description = meta["description"] as? String ?: "",
                coverImage = meta["coverImage"] as? String,
                tags = meta["tags"] as? List<String> ?: emptyList(),
                content = contentHtml
            )
        }.sortedByDescending { it.date }
    }

    fun getBlogs(limit: Int?): List<BlogDto> {
        return blogs.take(limit ?: blogs.size)
    }

    fun getBlogBySlug(slug: String): BlogDto? {
        return blogs.find { it.slug == slug }
    }
}
