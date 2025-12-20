package my.backend.db

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import my.backend.db.schema.BlogTable
import my.backend.db.schema.BlogTagsTable
import my.backend.db.schema.TagTable
import org.flywaydb.core.Flyway
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import javax.sql.DataSource

class DatabaseFactory(private val config: HikariConfig) {
    fun init() {
        val dataSource = HikariDataSource(config)
        Database.connect(dataSource)

        runFlyway(dataSource)

        transaction {
            SchemaUtils.create(BlogTable, TagTable, BlogTagsTable)
        }
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
