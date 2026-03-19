package my.backend.db.schema

import org.jetbrains.exposed.sql.Table

object TagTable : Table("tags") {
    val id = integer("id").autoIncrement()
    val name = varchar("name", 50).uniqueIndex()
    val displayOrder = integer("display_order").default(0)

    override val primaryKey = PrimaryKey(id)
}

object BlogTagsTable : Table("blog_tags") {
    val blogId = reference("blog_id", BlogTable.id)
    val tagId = reference("tag_id", TagTable.id)

    override val primaryKey = PrimaryKey(blogId, tagId)
}
