package my.backend.db.schema

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.datetime

object PortfolioTable : Table("portfolios") {
    val id = integer("id").autoIncrement()
    val slug = varchar("slug", 255).uniqueIndex()
    val title = varchar("title", 255)
    val description = text("description")
    val content = text("content")
    val coverImage = varchar("cover_image", 255).nullable()
    val date = datetime("date")

    override val primaryKey = PrimaryKey(id)
}

object PortfolioTagNameTable : Table("portfolio_tag_names") {
    val id = integer("id").autoIncrement()
    val name = varchar("name", 50).uniqueIndex()

    override val primaryKey = PrimaryKey(id)
}

object PortfolioTagsTable : Table("portfolio_tags") {
    val portfolioId = reference("portfolio_id", PortfolioTable.id)
    val tagId = reference("tag_id", PortfolioTagNameTable.id)

    override val primaryKey = PrimaryKey(portfolioId, tagId)
}
