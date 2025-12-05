package my.backend.service

import com.vladsch.flexmark.ext.autolink.AutolinkExtension
import com.vladsch.flexmark.ext.gfm.strikethrough.StrikethroughExtension
import com.vladsch.flexmark.ext.tables.TablesExtension
import com.vladsch.flexmark.html.HtmlRenderer
import com.vladsch.flexmark.parser.Parser
import com.vladsch.flexmark.util.data.MutableDataSet
import my.backend.dto.PortfolioDto
import org.yaml.snakeyaml.Yaml
import java.io.BufferedReader
import java.io.InputStreamReader
import java.nio.charset.StandardCharsets

class PortfolioService {
    private val parser: Parser
    private val renderer: HtmlRenderer
    private val portfolios: List<PortfolioDto>

    init {
        val options = MutableDataSet()
        options.set(
            Parser.EXTENSIONS,
            listOf(
                TablesExtension.create(),
                StrikethroughExtension.create(),
                AutolinkExtension.create(),
            ),
        )
        parser = Parser.builder(options).build()
        renderer = HtmlRenderer.builder(options).build()

        portfolios = loadPortfolios()
    }

    fun getPortfolios(limit: Int?): List<PortfolioDto> {
        return portfolios.take(limit ?: portfolios.size)
    }

    fun getPortfolioBySlug(slug: String): PortfolioDto? {
        return portfolios.find { it.slug == slug }
    }

    private fun loadPortfolios(): List<PortfolioDto> {
        val yaml = Yaml()

        val indexStream =
            javaClass.classLoader.getResourceAsStream("portfolios/index.txt") ?: return emptyList()

        val fileNames =
            indexStream.use { stream ->
                BufferedReader(InputStreamReader(stream, StandardCharsets.UTF_8))
                    .readLines()
                    .filter { it.isNotBlank() }
            }

        return fileNames
            .mapNotNull { fileName ->
                val resourceStream =
                    javaClass.classLoader.getResourceAsStream("portfolios/$fileName")
                        ?: return@mapNotNull null

                val content =
                    resourceStream.use { stream ->
                        stream.bufferedReader(StandardCharsets.UTF_8).readText()
                    }
                val parts = content.split("---", limit = 3)
                val frontMatter = parts.getOrNull(1) ?: ""
                val markdownBody = parts.getOrNull(2) ?: ""

                val meta: Map<String, Any> = yaml.load(frontMatter) ?: emptyMap()
                val contentHtml = renderer.render(parser.parse(markdownBody))

                @Suppress("UNCHECKED_CAST")
                PortfolioDto(
                    slug = fileName.replace(".md", ""),
                    title = meta["title"] as? String ?: "",
                    date = meta["date"] as? String ?: "",
                    description = meta["description"] as? String ?: "",
                    coverImage = meta["coverImage"] as? String,
                    tags = meta["tags"] as? List<String> ?: emptyList(),
                    content = contentHtml,
                )
            }
            .sortedByDescending {
                try {
                    // Handle different date formats
                    val dateStr = it.date
                    if (dateStr.contains("年")) {
                        java.time.LocalDate.parse(
                            dateStr,
                            java.time.format.DateTimeFormatter.ofPattern(
                                "yyyy年M月d日",
                                java.util.Locale.JAPAN,
                            ),
                        )
                    } else {
                        java.time.LocalDate.parse(dateStr)
                    }
                } catch (e: java.time.format.DateTimeParseException) {
                    java.time.LocalDate.MIN
                }
            }
    }
}
