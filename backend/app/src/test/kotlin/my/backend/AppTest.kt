package my.backend

import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.testing.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class AppTest {
    @Test
    fun `Blog APIのエンドポイントにアクセスできる`() = testApplication {
        application {
            module()
        }

        client.get("/api/blogs").apply {
            assertEquals(HttpStatusCode.OK, status)
            assertTrue(bodyAsText().contains("["))
        }
    }

    @Test
    fun `特定のスラッグのブログが存在しない場合は404を返す`() = testApplication {
        application {
            module()
        }

        client.get("/api/blogs/non-existent-blog").apply {
            assertEquals(HttpStatusCode.NotFound, status)
        }
    }

    @Test
    fun `無効なデータで問い合わせエンドポイントにアクセスすると400を返す`() = testApplication {
        application {
            module()
        }

        val jsonClient = createClient {
            install(ContentNegotiation) {
                json()
            }
        }

        jsonClient.post("/api/contact") {
            contentType(ContentType.Application.Json)
            setBody("""{"email":"","subject":"","message":"","turnstileToken":""}""")
        }.apply {
            assertEquals(HttpStatusCode.BadRequest, status)
            val body = bodyAsText()
            assertTrue(body.contains("入力値が無効です"))
        }
    }

    @Test
    fun `無効なメール形式で問い合わせエンドポイントにアクセスすると400を返す`() = testApplication {
        application {
            module()
        }

        val jsonClient = createClient {
            install(ContentNegotiation) {
                json()
            }
        }

        jsonClient.post("/api/contact") {
            contentType(ContentType.Application.Json)
            setBody("""{"email":"invalid-email","subject":"テスト件名","message":"これはテストメッセージです。","turnstileToken":"test-token"}""")
        }.apply {
            assertEquals(HttpStatusCode.BadRequest, status)
            val body = bodyAsText()
            assertTrue(body.contains("有効なメールアドレス"))
        }
    }

    @Test
    fun `件名が短すぎる場合は問い合わせエンドポイントが400を返す`() = testApplication {
        application {
            module()
        }

        val jsonClient = createClient {
            install(ContentNegotiation) {
                json()
            }
        }

        jsonClient.post("/api/contact") {
            contentType(ContentType.Application.Json)
            setBody("""{"email":"test@example.com","subject":"ab","message":"これはテストメッセージです。","turnstileToken":"test-token"}""")
        }.apply {
            assertEquals(HttpStatusCode.BadRequest, status)
            val body = bodyAsText()
            assertTrue(body.contains("件名は3文字以上"))
        }
    }

    @Test
    fun `メッセージが短すぎる場合は問い合わせエンドポイントが400を返す`() = testApplication {
        application {
            module()
        }

        val jsonClient = createClient {
            install(ContentNegotiation) {
                json()
            }
        }

        jsonClient.post("/api/contact") {
            contentType(ContentType.Application.Json)
            setBody("""{"email":"test@example.com","subject":"テスト件名","message":"短い","turnstileToken":"test-token"}""")
        }.apply {
            assertEquals(HttpStatusCode.BadRequest, status)
            val body = bodyAsText()
            assertTrue(body.contains("メッセージは10文字以上"))
        }
    }
}
