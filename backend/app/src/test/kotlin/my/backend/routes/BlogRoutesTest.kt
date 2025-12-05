package my.backend.routes

import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue
import org.junit.jupiter.api.AfterEach
import org.koin.core.context.stopKoin

class BlogRoutesTest {
    @AfterEach
    fun tearDown() {
        stopKoin()
    }

    @Test
    fun `ブログ一覧を取得できる`() = testApplication {
        client.get("/api/blogs").apply {
            assertEquals(HttpStatusCode.OK, status)
            assertTrue(bodyAsText().contains("["))
        }
    }

    @Test
    fun `存在しないスラッグのブログは404を返す`() = testApplication {
        client.get("/api/blogs/non-existent-blog").apply {
            assertEquals(HttpStatusCode.NotFound, status)
        }
    }
}
