package my.backend.plugins

import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.config.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.testing.*
import my.backend.testutil.testApplicationWithH2
import java.util.concurrent.atomic.AtomicBoolean
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class CsrfProtectionTest {
    @Test
    fun `不正なOriginのPOSTは403を返す`() =
        testApplicationWithH2 {
            val jsonClient = createClient { install(ContentNegotiation) { json() } }

            jsonClient
                .post("/api/contact") {
                    contentType(ContentType.Application.Json)
                    header(HttpHeaders.Origin, "https://attacker.example")
                    setBody("""{"email":"","subject":"","message":"","turnstileToken":""}""")
                }.apply {
                    assertEquals(HttpStatusCode.Forbidden, status)
                }
        }

    @Test
    fun `不正なOriginのPOSTではハンドラの副作用が実行されない`() =
        testApplication {
            val handlerExecuted = AtomicBoolean(false)
            val jsonClient = createClient { install(ContentNegotiation) { json() } }

            environment {
                config =
                    MapApplicationConfig().apply {
                        put("app.cors.allowed-origins", "http://localhost:3000")
                    }
            }

            application {
                configureSerialization()
                configureStatusPages()
                configureCsrfProtection()

                routing {
                    post("/csrf-check") {
                        handlerExecuted.set(true)
                        call.respond(HttpStatusCode.OK)
                    }
                }
            }

            val response =
                jsonClient.post("/csrf-check") {
                    header(HttpHeaders.Origin, "https://attacker.example")
                }

            assertEquals(HttpStatusCode.Forbidden, response.status)
            assertTrue(response.bodyAsText().contains("不正なオリジン"))
            assertFalse(
                handlerExecuted.get(),
                "CSRF block should stop the route handler before side effects run.",
            )
        }
}
