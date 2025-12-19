package my.backend.db

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import my.backend.db.schema.BlogTable
import my.backend.db.schema.BlogTagsTable
import my.backend.db.schema.TagTable
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction

object DatabaseFactory {
    fun init() {
        val config =
            HikariConfig().apply {
                driverClassName = System.getenv("DB_DRIVER")
                jdbcUrl = System.getenv("DB_URL")
                username = System.getenv("DB_USER")
                password = System.getenv("DB_PASSWORD")
                maximumPoolSize = 3
                isAutoCommit = false
                transactionIsolation = "TRANSACTION_REPEATABLE_READ"
                validate()
            }
        val dataSource = HikariDataSource(config)
        Database.connect(dataSource)

        transaction {
            SchemaUtils.create(BlogTable, TagTable, BlogTagsTable)
        }
    }
}
