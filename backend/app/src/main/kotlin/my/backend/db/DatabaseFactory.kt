package my.backend.db

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import org.flywaydb.core.Flyway
import org.jetbrains.exposed.sql.Database
import javax.sql.DataSource

class DatabaseFactory(private val config: HikariConfig) {
    fun init() {
        val dataSource = HikariDataSource(config)
        Database.connect(dataSource)

        runFlyway(dataSource)
    }

    private fun runFlyway(dataSource: DataSource) {
        val flyway =
            Flyway.configure()
                .dataSource(dataSource)
                .locations("classpath:db/migration")
                .baselineOnMigrate(true)
                .load()

        flyway.migrate()
    }
}
