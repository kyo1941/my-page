package my.backend.routes

import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import my.backend.testutil.testApplicationWithH2
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class BlogRoutesTest {
    @Test
    fun `ブログ一覧を取得できる`() =
        testApplicationWithH2 {
            client.get("/api/blogs").apply {
                assertEquals(HttpStatusCode.OK, status)
                assertTrue(bodyAsText().contains("["))
            }
        }

    @Test
    fun `存在しないスラッグのブログは404を返す`() =
        testApplicationWithH2 {
            client.get("/api/blogs/non-existent-blog").apply {
                assertEquals(HttpStatusCode.NotFound, status)
            }
        }
}
