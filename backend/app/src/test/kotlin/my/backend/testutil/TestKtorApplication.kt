package my.backend.testutil

import io.ktor.server.config.MapApplicationConfig
import io.ktor.server.testing.ApplicationTestBuilder
import io.ktor.server.testing.testApplication
import my.backend.module
import org.koin.core.context.stopKoin

/**
 * routesテスト向けの共通 testApplication ラッパー。
 * - environment.config を H2(in-memory) に差し替え
 * - Application.module() を明示的にロード
 * - 終了時に stopKoin() を必ず呼ぶ
 */
fun testApplicationWithH2(test: suspend ApplicationTestBuilder.() -> Unit) {
    testApplication {
        val testConfig = h2TestConfig()

        environment {
            config = testConfig
        }

        application {
            module()
        }

        try {
            test()
        } finally {
            stopKoin()
        }
    }
}

private fun h2TestConfig(): MapApplicationConfig =
    MapApplicationConfig().apply {
        put("storage.driverClassName", "org.h2.Driver")
        put("storage.jdbcURL", "jdbc:h2:mem:test;DB_CLOSE_DELAY=-1;MODE=MySQL;DATABASE_TO_LOWER=TRUE")
        put("storage.user", "root")
        put("storage.password", "")
        put("storage.maxPoolSize", "2")

        // JWT 関連設定
        put("jwt.secret", "test_secret_key_1234567890")
        put("jwt.issuer", "test_issuer")
        put("jwt.audience", "test_audience")
        put("jwt.realm", "test_realm")

        // DI 解決に必要な値（外部通信は routes テストでは行わない想定）
        put("app.resend.api-key", "dummy_key")
        put("app.resend.from-email", "no-reply@example.com")
        put("app.turnstile.secret-key", "dummy_secret")
        put("app.contact.recipient-email", "recipient@example.com")
    }
