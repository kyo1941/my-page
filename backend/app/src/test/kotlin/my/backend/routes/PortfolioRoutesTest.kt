package my.backend.routes

import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import my.backend.testutil.testApplicationWithH2
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class PortfolioRoutesTest {
    @Test
    fun `ポートフォリオ一覧を取得できる`() =
        testApplicationWithH2 {
            client.get("/api/portfolios").apply {
                assertEquals(HttpStatusCode.OK, status)
                assertTrue(bodyAsText().contains("["))
            }
        }

    @Test
    fun `存在しないスラッグのポートフォリオは404を返す`() =
        testApplicationWithH2 {
            client.get("/api/portfolios/non-existent-portfolio").apply {
                assertEquals(HttpStatusCode.NotFound, status)
            }
        }
}
