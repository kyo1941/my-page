package my.backend.routes

import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.testing.*
import org.junit.jupiter.api.AfterEach
import org.koin.core.context.stopKoin
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class PortfolioRoutesTest {
    @AfterEach
    fun tearDown() {
        stopKoin()
    }

    @Test
    fun `ポートフォリオ一覧を取得できる`() =
        testApplication {
            client.get("/api/portfolios").apply {
                assertEquals(HttpStatusCode.OK, status)
                assertTrue(bodyAsText().contains("["))
            }
        }

    @Test
    fun `存在しないスラッグのポートフォリオは404を返す`() =
        testApplication {
            client.get("/api/portfolios/non-existent-portfolio").apply {
                assertEquals(HttpStatusCode.NotFound, status)
            }
        }
}
