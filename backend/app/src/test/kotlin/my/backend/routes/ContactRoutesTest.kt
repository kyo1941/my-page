package my.backend.routes

import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.testing.*
import org.junit.jupiter.api.AfterEach
import org.koin.core.context.stopKoin
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class ContactRoutesTest {
    @AfterEach
    fun tearDown() {
        stopKoin()
    }

    @Test
    fun `空のデータで問い合わせすると400を返す`() =
        testApplication {
            val jsonClient = createClient { install(ContentNegotiation) { json() } }

            jsonClient
                .post("/api/contact") {
                    contentType(ContentType.Application.Json)
                    setBody("""{"email":"","subject":"","message":"","turnstileToken":""}""")
                }
                .apply {
                    assertEquals(HttpStatusCode.BadRequest, status)
                    assertTrue(bodyAsText().contains("入力値が無効です"))
                }
        }

    @Test
    fun `無効なメール形式で問い合わせすると400を返す`() =
        testApplication {
            val jsonClient = createClient { install(ContentNegotiation) { json() } }

            jsonClient
                .post("/api/contact") {
                    contentType(ContentType.Application.Json)
                    setBody(
                        """{"email":"invalid-email","subject":"テスト件名",""" +
                            """"message":"これはテストメッセージです。","turnstileToken":"test-token"}""",
                    )
                }
                .apply {
                    assertEquals(HttpStatusCode.BadRequest, status)
                    assertTrue(bodyAsText().contains("有効なメールアドレス"))
                }
        }

    @Test
    fun `件名が3文字未満の場合は400を返す`() =
        testApplication {
            val jsonClient = createClient { install(ContentNegotiation) { json() } }

            jsonClient
                .post("/api/contact") {
                    contentType(ContentType.Application.Json)
                    setBody(
                        """{"email":"test@example.com","subject":"ab",""" +
                            """"message":"これはテストメッセージです。","turnstileToken":"test-token"}""",
                    )
                }
                .apply {
                    assertEquals(HttpStatusCode.BadRequest, status)
                    assertTrue(bodyAsText().contains("件名は3文字以上"))
                }
        }

    @Test
    fun `メッセージが10文字未満の場合は400を返す`() =
        testApplication {
            val jsonClient = createClient { install(ContentNegotiation) { json() } }

            jsonClient
                .post("/api/contact") {
                    contentType(ContentType.Application.Json)
                    setBody(
                        """{"email":"test@example.com","subject":"テスト件名",""" +
                            """"message":"短い","turnstileToken":"test-token"}""",
                    )
                }
                .apply {
                    assertEquals(HttpStatusCode.BadRequest, status)
                    assertTrue(bodyAsText().contains("メッセージは10文字以上"))
                }
        }
}
