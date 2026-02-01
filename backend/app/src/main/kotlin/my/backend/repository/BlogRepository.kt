package my.backend.repository

import my.backend.db.schema.BlogTable
import my.backend.db.schema.BlogTagsTable
import my.backend.db.schema.TagTable
import my.backend.dto.BlogDto
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.Locale

interface BlogRepository {
    suspend fun findAll(
        limit: Int? = null,
        tags: List<String>? = null,
        keyword: String? = null,
    ): List<BlogDto>

    suspend fun findBySlug(slug: String): BlogDto?

    suspend fun create(blog: BlogDto): BlogDto

    suspend fun update(
        slug: String,
        blog: BlogDto,
    ): BlogDto?

    suspend fun delete(slug: String): Boolean
}

class BlogRepositoryImpl : BlogRepository {
    private val dateFormatter = DateTimeFormatter.ofPattern("yyyy年M月d日", Locale.JAPAN)

    override suspend fun findAll(
        limit: Int?,
        tags: List<String>?,
        keyword: String?,
    ): List<BlogDto> =
        newSuspendedTransaction {
            val query = BlogTable.selectAll()

            if (!tags.isNullOrEmpty()) {
                val blogIdsWithTags =
                    (BlogTagsTable innerJoin TagTable)
                        .selectAll().where { TagTable.name inList tags }
                        .map { it[BlogTagsTable.blogId] }

                query.andWhere { BlogTable.id inList blogIdsWithTags }
            }

            if (!keyword.isNullOrBlank()) {
                query.andWhere {
                    (BlogTable.title like "%$keyword%") or (BlogTable.description like "%$keyword%")
                }
            }

            query.orderBy(BlogTable.date to SortOrder.DESC)

            val resultQuery = if (limit != null) query.limit(limit) else query

            resultQuery.map { toBlogDto(it) }
        }

    override suspend fun findBySlug(slug: String): BlogDto? =
        newSuspendedTransaction {
            BlogTable.selectAll().where { BlogTable.slug eq slug }
                .singleOrNull()
                ?.let { toBlogDto(it) }
        }

    override suspend fun create(blog: BlogDto): BlogDto =
        newSuspendedTransaction {
            val blogId =
                BlogTable.insert {
                    it[slug] = blog.slug
                    it[title] = blog.title
                    it[description] = blog.description
                    it[content] = blog.content
                    it[coverImage] = blog.coverImage
                    it[date] = parseDate(blog.date)
                } get BlogTable.id

            updateTags(blogId, blog.tags)

            blog
        }

    override suspend fun update(
        slug: String,
        blog: BlogDto,
    ): BlogDto? =
        newSuspendedTransaction {
            val existing =
                BlogTable.selectAll().where { BlogTable.slug eq slug }
                    .singleOrNull() ?: return@newSuspendedTransaction null
            val id = existing[BlogTable.id]

            BlogTable.update({ BlogTable.id eq id }) {
                it[title] = blog.title
                it[description] = blog.description
                it[content] = blog.content
                it[coverImage] = blog.coverImage
                it[date] = parseDate(blog.date)
            }

            updateTags(id, blog.tags)

            blog
        }

    override suspend fun delete(slug: String): Boolean =
        newSuspendedTransaction {
            val existing =
                BlogTable.selectAll().where { BlogTable.slug eq slug }
                    .singleOrNull() ?: return@newSuspendedTransaction false
            val id = existing[BlogTable.id]

            BlogTagsTable.deleteWhere { blogId eq id }

            BlogTable.deleteWhere { BlogTable.id eq id } > 0
        }

    private fun toBlogDto(row: ResultRow): BlogDto {
        val blogId = row[BlogTable.id]
        val tags =
            (BlogTagsTable innerJoin TagTable)
                .selectAll().where { BlogTagsTable.blogId eq blogId }
                .map { it[TagTable.name] }

        return BlogDto(
            slug = row[BlogTable.slug],
            title = row[BlogTable.title],
            date = row[BlogTable.date].format(dateFormatter),
            description = row[BlogTable.description],
            coverImage = row[BlogTable.coverImage],
            tags = tags,
            content = row[BlogTable.content],
        )
    }

    private fun updateTags(
        blogId: Int,
        tags: List<String>,
    ) {
        BlogTagsTable.deleteWhere { BlogTagsTable.blogId eq blogId }

        if (tags.isEmpty()) return

        TagTable.batchInsert(tags, ignore = true) { tagName ->
            this[TagTable.name] = tagName
        }

        val tagIds = TagTable.selectAll().where { TagTable.name inList tags }.map { it[TagTable.id] }

        BlogTagsTable.batchInsert(tagIds) { tagId ->
            this[BlogTagsTable.blogId] = blogId
            this[BlogTagsTable.tagId] = tagId
        }
    }

    private fun parseDate(dateString: String): LocalDateTime {
        return try {
            LocalDate.parse(dateString, dateFormatter).atStartOfDay()
        } catch (e: Exception) {
            LocalDateTime.now()
        }
    }
}
