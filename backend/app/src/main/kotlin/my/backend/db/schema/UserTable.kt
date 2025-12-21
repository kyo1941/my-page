package my.backend.db.schema

import org.jetbrains.exposed.sql.Table

object UserTable : Table("users") {
    val id = integer("id").autoIncrement()
    val username = varchar("username", 50).uniqueIndex()
    val password = varchar("password", 255) // Hashed password

    override val primaryKey = PrimaryKey(id)
}

