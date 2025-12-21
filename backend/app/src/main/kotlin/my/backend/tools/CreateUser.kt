package my.backend.tools

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import my.backend.db.schema.UserTable
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.transaction
import org.mindrot.jbcrypt.BCrypt

fun main() {
    val dbUrl = System.getenv("DB_URL") ?: error("DB_URL is not set")
    val dbUser = System.getenv("DB_USER") ?: error("DB_USER is not set")
    val dbPassword = System.getenv("DB_PASSWORD") ?: error("DB_PASSWORD is not set")

    val config =
        HikariConfig().apply {
            jdbcUrl = dbUrl
            username = dbUser
            password = dbPassword
            driverClassName = "com.mysql.cj.jdbc.Driver"
        }

    val dataSource = HikariDataSource(config)
    Database.connect(dataSource)

    val username = System.getenv("ADMIN_USERNAME") ?: error("ADMIN_USERNAME is not set")
    val password = System.getenv("ADMIN_PASSWORD") ?: error("ADMIN_PASSWORD is not set")

    try {
        transaction {
            SchemaUtils.create(UserTable)

            UserTable.insert {
                it[UserTable.username] = username
                it[UserTable.password] = BCrypt.hashpw(password, BCrypt.gensalt())
            }
        }
        println("User created successfully!")
    } catch (e: Exception) {
        println("Failed to create user: ${e.message}")
    }
}
