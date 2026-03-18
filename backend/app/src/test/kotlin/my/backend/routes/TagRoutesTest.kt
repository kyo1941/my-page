package my.backend.routes

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.int
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import my.backend.testutil.testApplicationWithH2
import kotlinx.serialization.json.jsonArray
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class TagRoutesTest {
    private fun generateTestJwt(): String =
        JWT
            .create()
            .withAudience("test_audience")
            .withIssuer("test_issuer")
            .withClaim("username", "testuser")
            .sign(Algorithm.HMAC256("test_secret_key_1234567890"))

    private fun HttpRequestBuilder.allowedOrigin() {
        header(HttpHeaders.Origin, "http://localhost:3000")
    }

    private suspend fun createTag(
        client: io.ktor.client.HttpClient,
        token: String,
        name: String,
    ): Int {
        val body =
            client.post("/api/tags") {
                allowedOrigin()
                cookie("auth_token", token)
                contentType(ContentType.Application.Json)
                setBody("""{"name":"$name"}""")
            }.bodyAsText()
        return Json.parseToJsonElement(body).jsonObject["id"]!!.jsonPrimitive.int
    }

    // --- GET /api/tags ---

    @Test
    fun `タグ一覧を取得できる`() =
        testApplicationWithH2 {
            client.get("/api/tags").apply {
                assertEquals(HttpStatusCode.OK, status)
                assertTrue(bodyAsText().contains("["))
            }
        }

    // --- POST /api/tags ---

    @Test
    fun `認証なしでタグを作成すると401を返す`() =
        testApplicationWithH2 {
            client.post("/api/tags") {
                allowedOrigin()
                contentType(ContentType.Application.Json)
                setBody("""{"name":"未認証タグ"}""")
            }.apply {
                assertEquals(HttpStatusCode.Unauthorized, status)
            }
        }

    @Test
    fun `タグを作成できる`() =
        testApplicationWithH2 {
            val token = generateTestJwt()
            client.post("/api/tags") {
                allowedOrigin()
                cookie("auth_token", token)
                contentType(ContentType.Application.Json)
                setBody("""{"name":"新規タグ_create"}""")
            }.apply {
                assertEquals(HttpStatusCode.Created, status)
                assertTrue(bodyAsText().contains("新規タグ_create"))
            }
        }

    @Test
    fun `作成したタグが一覧に反映される`() =
        testApplicationWithH2 {
            val token = generateTestJwt()
            client.post("/api/tags") {
                allowedOrigin()
                cookie("auth_token", token)
                contentType(ContentType.Application.Json)
                setBody("""{"name":"一覧確認タグ"}""")
            }
            client.get("/api/tags").apply {
                assertEquals(HttpStatusCode.OK, status)
                assertTrue(bodyAsText().contains("一覧確認タグ"))
            }
        }

    @Test
    fun `同じ名前のタグは登録できない`() =
        testApplicationWithH2 {
            val token = generateTestJwt()
            client.post("/api/tags") {
                allowedOrigin()
                cookie("auth_token", token)
                contentType(ContentType.Application.Json)
                setBody("""{"name":"重複テストタグ"}""")
            }.apply {
                assertEquals(HttpStatusCode.Created, status)
            }
            client.post("/api/tags") {
                allowedOrigin()
                cookie("auth_token", token)
                contentType(ContentType.Application.Json)
                setBody("""{"name":"重複テストタグ"}""")
            }.apply {
                assertEquals(HttpStatusCode.Conflict, status)
            }
        }

    // --- PUT /api/tags/{id} ---

    @Test
    fun `タグを更新できる`() =
        testApplicationWithH2 {
            val token = generateTestJwt()
            val id = createTag(client, token, "更新前タグ")

            client.put("/api/tags/$id") {
                allowedOrigin()
                cookie("auth_token", token)
                contentType(ContentType.Application.Json)
                setBody("""{"name":"更新後タグ"}""")
            }.apply {
                assertEquals(HttpStatusCode.OK, status)
                assertTrue(bodyAsText().contains("更新後タグ"))
            }
        }

    @Test
    fun `タグを自分自身と同じ名前へ更新できる`() =
        testApplicationWithH2 {
            val token = generateTestJwt()
            val id = createTag(client, token, "同名更新タグ")

            client.put("/api/tags/$id") {
                allowedOrigin()
                cookie("auth_token", token)
                contentType(ContentType.Application.Json)
                setBody("""{"name":"同名更新タグ"}""")
            }.apply {
                assertEquals(HttpStatusCode.OK, status)
            }
        }

    @Test
    fun `別のタグと同じ名前への更新はできない`() =
        testApplicationWithH2 {
            val token = generateTestJwt()
            createTag(client, token, "重複更新タグA")
            val idB = createTag(client, token, "重複更新タグB")

            client.put("/api/tags/$idB") {
                allowedOrigin()
                cookie("auth_token", token)
                contentType(ContentType.Application.Json)
                setBody("""{"name":"重複更新タグA"}""")
            }.apply {
                assertEquals(HttpStatusCode.Conflict, status)
            }
        }

    @Test
    fun `存在しないタグの更新は404を返す`() =
        testApplicationWithH2 {
            val token = generateTestJwt()
            client.put("/api/tags/99999") {
                allowedOrigin()
                cookie("auth_token", token)
                contentType(ContentType.Application.Json)
                setBody("""{"name":"存在しないタグ更新"}""")
            }.apply {
                assertEquals(HttpStatusCode.NotFound, status)
            }
        }

    // --- DELETE /api/tags/{id} ---

    @Test
    fun `認証なしでタグを削除すると401を返す`() =
        testApplicationWithH2 {
            client.delete("/api/tags/1") {
                allowedOrigin()
            }.apply {
                assertEquals(HttpStatusCode.Unauthorized, status)
            }
        }

    @Test
    fun `タグを削除できる`() =
        testApplicationWithH2 {
            val token = generateTestJwt()
            val id = createTag(client, token, "削除対象タグ")

            client.delete("/api/tags/$id") {
                allowedOrigin()
                cookie("auth_token", token)
            }.apply {
                assertEquals(HttpStatusCode.NoContent, status)
            }
        }

    @Test
    fun `削除したタグは一覧に存在しない`() =
        testApplicationWithH2 {
            val token = generateTestJwt()
            val id = createTag(client, token, "削除後確認タグ")

            client.delete("/api/tags/$id") {
                allowedOrigin()
                cookie("auth_token", token)
            }

            client.get("/api/tags").apply {
                assertFalse(bodyAsText().contains("削除後確認タグ"))
            }
        }

    // --- PUT /api/tags/order ---

    @Test
    fun `認証なしで順序変更すると401を返す`() =
        testApplicationWithH2 {
            client.put("/api/tags/order") {
                allowedOrigin()
                contentType(ContentType.Application.Json)
                setBody("""{"orders":[]}""")
            }.apply {
                assertEquals(HttpStatusCode.Unauthorized, status)
            }
        }

    @Test
    fun `タグの表示順序を変更できる`() =
        testApplicationWithH2 {
            val token = generateTestJwt()
            val idA = createTag(client, token, "順序タグA")
            val idB = createTag(client, token, "順序タグB")
            val idC = createTag(client, token, "順序タグC")

            client.put("/api/tags/order") {
                allowedOrigin()
                cookie("auth_token", token)
                contentType(ContentType.Application.Json)
                setBody("""{"orders":[{"id":$idC,"displayOrder":0},{"id":$idA,"displayOrder":1},{"id":$idB,"displayOrder":2}]}""")
            }.apply {
                assertEquals(HttpStatusCode.OK, status)
            }

            client.get("/api/tags").apply {
                assertEquals(HttpStatusCode.OK, status)
                val arr = Json.parseToJsonElement(bodyAsText()).jsonArray
                val names = arr.map { it.jsonObject["name"]!!.jsonPrimitive.content }
                val cIdx = names.indexOf("順序タグC")
                val aIdx = names.indexOf("順序タグA")
                val bIdx = names.indexOf("順序タグB")
                assertTrue(aIdx in (cIdx + 1)..<bIdx)
            }
        }

    @Test
    fun `存在しないタグの削除は404を返す`() =
        testApplicationWithH2 {
            val token = generateTestJwt()
            client.delete("/api/tags/99999") {
                allowedOrigin()
                cookie("auth_token", token)
            }.apply {
                assertEquals(HttpStatusCode.NotFound, status)
            }
        }
}
