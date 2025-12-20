package my.backend.db.schema

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.datetime

object BlogTable : Table("blogs") {
    val id = integer("id").autoIncrement()
    val slug = varchar("slug", 255).uniqueIndex()
    val title = varchar("title", 255)
    val description = text("description")
    val content = text("content")
    val coverImage = varchar("cover_image", 255).nullable()
    val date = datetime("date")

    override val primaryKey = PrimaryKey(id)
}

object TagTable : Table("tags") {
    val id = integer("id").autoIncrement()
    val name = varchar("name", 50).uniqueIndex()

    override val primaryKey = PrimaryKey(id)
}

object BlogTagsTable : Table("blog_tags") {
    val blogId = reference("blog_id", BlogTable.id)
    val tagId = reference("tag_id", TagTable.id)

    override val primaryKey = PrimaryKey(blogId, tagId)
}
