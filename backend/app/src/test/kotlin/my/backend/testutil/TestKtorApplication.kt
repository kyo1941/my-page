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
        // MODE=MYSQL は本番が MySQL のため。互換不要なら外してOK。
        put("storage.jdbcURL", "jdbc:h2:mem:test;DB_CLOSE_DELAY=-1;MODE=MYSQL")
        put("storage.user", "root")
        put("storage.password", "")

        // DI 解決に必要な値（外部通信は routes テストでは行わない想定）
        put("app.resend.api-key", "dummy_key")
        put("app.resend.from-email", "no-reply@example.com")
        put("app.turnstile.secret-key", "dummy_secret")
        put("app.contact.recipient-email", "recipient@example.com")
    }
