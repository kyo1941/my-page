package db.migration

import org.flywaydb.core.api.migration.BaseJavaMigration
import org.flywaydb.core.api.migration.Context
import org.mindrot.jbcrypt.BCrypt

@Suppress("unused", "ClassName")
class V2__InsertAdminUser : BaseJavaMigration() {
    override fun migrate(context: Context) {
        val username = System.getenv("ADMIN_USERNAME")
        val password = System.getenv("ADMIN_PASSWORD")

        if (username.isNullOrBlank() || password.isNullOrBlank()) {
            throw RuntimeException(
                "Environment variables ADMIN_USERNAME and ADMIN_PASSWORD must be set for migration V2.",
            )
        }

        val hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt())

        context.connection.prepareStatement("INSERT INTO users (username, password) VALUES (?, ?)").use { statement ->
            statement.setString(1, username)
            statement.setString(2, hashedPassword)
            statement.execute()
        }
    }
}
