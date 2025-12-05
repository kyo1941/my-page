package my.backend.service

import com.resend.Resend
import com.resend.services.emails.Emails
import com.resend.services.emails.model.SendEmailRequest
import com.resend.services.emails.model.SendEmailResponse
import io.ktor.client.*
import io.ktor.client.engine.mock.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.config.*
import io.mockk.*
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.Json
import my.backend.dto.ContactFormRequest
import my.backend.exception.TurnstileVerificationException
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.koin.core.context.stopKoin
import kotlin.test.assertEquals

class ContactServiceTest {
    private lateinit var mockConfig: ApplicationConfig
    private lateinit var mockResend: Resend
    private lateinit var mockEmails: Emails

    @BeforeEach
    fun setup() {
        // ApplicationConfigのモック
        mockConfig =
            mockk {
                every { property("app.turnstile.secret-key").getString() } returns "test-secret-key"
                every { property("app.contact.recipient-email").getString() } returns "test@example.com"
                every { property("app.resend.api-key").getString() } returns "test-api-key"
                every { property("app.resend.from-email").getString() } returns "noreply@example.com"
            }

        // Resendのモック
        mockEmails =
            mockk {
                every { send(any<SendEmailRequest>()) } returns mockk<SendEmailResponse>()
            }
        mockResend = mockk { every { emails() } returns mockEmails }
    }

    @AfterEach
    fun tearDown() {
        clearAllMocks()
        stopKoin()
    }

    private fun createMockHttpClient(
        responseJson: String,
        statusCode: HttpStatusCode = HttpStatusCode.OK,
    ): HttpClient {
        return HttpClient(MockEngine) {
            engine {
                addHandler {
                    respond(
                        content = responseJson,
                        status = statusCode,
                        headers =
                            headersOf(
                                HttpHeaders.ContentType,
                                ContentType.Application.Json.toString(),
                            ),
                    )
                }
            }
            install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) }
        }
    }

    @Test
    fun `Turnstile認証成功時にメールが送信される`() =
        runBlocking {
            // Turnstile成功レスポンス
            val mockClient = createMockHttpClient("""{"success": true}""")
            val service = ContactService(mockConfig, mockClient, mockResend)

            val request =
                ContactFormRequest(
                    email = "sender@example.com",
                    subject = "テスト件名",
                    message = "テストメッセージ",
                    turnstileToken = "valid-token",
                )

            // 実行
            service.processContactRequest(request)

            // メール送信が呼ばれたことを検証
            verify(exactly = 1) { mockEmails.send(any<SendEmailRequest>()) }
        }

    @Test
    fun `Turnstile認証失敗時に例外がスローされる`() =
        runBlocking {
            // Turnstile失敗レスポンス
            val mockClient =
                createMockHttpClient(
                    """{"success": false, "error-codes": ["invalid-input-response"]}""",
                )
            val service = ContactService(mockConfig, mockClient, mockResend)

            val request =
                ContactFormRequest(
                    email = "sender@example.com",
                    subject = "テスト件名",
                    message = "テストメッセージ",
                    turnstileToken = "invalid-token",
                )

            // TurnstileVerificationExceptionがスローされることを検証
            val exception =
                assertThrows<TurnstileVerificationException> {
                    service.processContactRequest(request)
                }
            assertEquals("Turnstile verification failed", exception.message)

            // メール送信が呼ばれていないことを検証
            verify(exactly = 0) { mockEmails.send(any<SendEmailRequest>()) }
        }

    @Test
    fun `メール送信時に正しい内容が設定される`() =
        runBlocking {
            val mockClient = createMockHttpClient("""{"success": true}""")

            // キャプチャ用スロット（テスト内で再設定）
            val emailSlot = slot<SendEmailRequest>()
            val testMockEmails: Emails =
                mockk {
                    every { send(capture(emailSlot)) } returns mockk<SendEmailResponse>()
                }
            val testMockResend: Resend = mockk { every { emails() } returns testMockEmails }

            val service = ContactService(mockConfig, mockClient, testMockResend)

            val request =
                ContactFormRequest(
                    email = "sender@example.com",
                    subject = "重要な件名",
                    message = "これは重要なメッセージです。",
                    turnstileToken = "valid-token",
                )

            // 実行
            service.processContactRequest(request)

            // メール内容を検証
            val sentEmail = emailSlot.captured
            assertEquals("noreply@example.com", sentEmail.from)
            assertEquals("test@example.com", sentEmail.to[0])
            assertEquals("[お問い合わせ] 重要な件名", sentEmail.subject)
            @Suppress("UNCHECKED_CAST")
            val replyToList = sentEmail.replyTo as List<String>
            assertEquals("sender@example.com", replyToList[0])
        }

    @Test
    fun `XSS攻撃を含むメッセージがエスケープされる`() =
        runBlocking {
            val mockClient = createMockHttpClient("""{"success": true}""")

            // キャプチャ用スロット（テスト内で再設定）
            val emailSlot = slot<SendEmailRequest>()
            val testMockEmails: Emails =
                mockk {
                    every { send(capture(emailSlot)) } returns mockk<SendEmailResponse>()
                }
            val testMockResend: Resend = mockk { every { emails() } returns testMockEmails }

            val service = ContactService(mockConfig, mockClient, testMockResend)

            val request =
                ContactFormRequest(
                    email = "attacker@example.com",
                    subject = "<script>alert('xss')</script>",
                    message = "<img src=x onerror=alert('xss')>",
                    turnstileToken = "valid-token",
                )

            // 実行
            service.processContactRequest(request)

            // HTMLエスケープされていることを検証
            val sentEmail = emailSlot.captured
            val html = sentEmail.html

            // スクリプトタグがエスケープされていること
            kotlin.test.assertFalse(html.contains("<script>"), "Script tag should be escaped")
            kotlin.test.assertTrue(html.contains("&lt;script&gt;"), "Script tag should be HTML escaped")
        }
}
