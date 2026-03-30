package my.backend.service

import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import kotlinx.coroutines.withTimeout
import my.backend.dto.OgpResponseDto
import org.jsoup.Jsoup
import org.slf4j.LoggerFactory
import java.net.InetAddress
import java.net.URI
import java.util.concurrent.ConcurrentHashMap

class OgpService(private val client: HttpClient) {
    private val logger = LoggerFactory.getLogger(OgpService::class.java)
    private val cache = ConcurrentHashMap<String, OgpResponseDto?>()

    suspend fun fetchOgp(rawUrl: String): OgpResponseDto? {
        if (cache.containsKey(rawUrl)) return cache[rawUrl]

        val result =
            runCatching { doFetch(rawUrl) }.getOrElse {
                logger.warn("Failed to fetch OGP for $rawUrl: ${it.message}")
                null
            }
        cache[rawUrl] = result
        return result
    }

    private suspend fun doFetch(rawUrl: String): OgpResponseDto? {
        if (!rawUrl.startsWith("http://") && !rawUrl.startsWith("https://")) return null

        val uri = URI(rawUrl)
        val host = uri.host ?: return null
        val address = runCatching { InetAddress.getByName(host) }.getOrNull() ?: return null
        if (address.isLoopbackAddress || address.isSiteLocalAddress) return null

        val html =
            withTimeout(5_000) {
                val response =
                    client.get(rawUrl) {
                        headers { append(HttpHeaders.UserAgent, "Mozilla/5.0 (compatible; OGPBot/1.0)") }
                    }
                if (!response.status.isSuccess()) return@withTimeout null
                val contentType = response.contentType()?.contentType
                if (contentType != "text") return@withTimeout null
                response.bodyAsText()
            } ?: return null

        return parseOgp(rawUrl, html)
    }

    private fun parseOgp(
        pageUrl: String,
        html: String,
    ): OgpResponseDto {
        val doc = Jsoup.parse(html, pageUrl)

        fun meta(property: String): String? =
            doc.selectFirst("meta[property=$property]")?.attr("content")?.takeIf { it.isNotBlank() }
                ?: doc.selectFirst("meta[name=$property]")?.attr("content")?.takeIf { it.isNotBlank() }

        fun resolveUrl(href: String?): String? {
            if (href.isNullOrBlank()) return null
            return runCatching { URI(pageUrl).resolve(href).toString() }.getOrNull()
        }

        val favicon = doc.selectFirst("link[rel~=icon]")?.attr("href")?.let { resolveUrl(it) }

        return OgpResponseDto(
            url = pageUrl,
            title = meta("og:title") ?: doc.title().takeIf { it.isNotBlank() },
            description = meta("og:description") ?: meta("description"),
            image = resolveUrl(meta("og:image")),
            siteName = meta("og:site_name"),
            favicon = favicon,
        )
    }
}
