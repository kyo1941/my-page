package my.backend.repository

import my.backend.db.schema.BlogTable
import my.backend.db.schema.BlogTagsTable
import my.backend.db.schema.TagTable
import my.backend.dto.BlogRequestDto
import my.backend.dto.BlogResponseDto
import my.backend.util.SlugGenerator
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
    ): List<BlogResponseDto>

    suspend fun findBySlug(slug: String): BlogResponseDto?

    suspend fun create(blog: BlogRequestDto): BlogResponseDto

    suspend fun update(
        slug: String,
        blog: BlogRequestDto,
    ): BlogResponseDto?

    suspend fun delete(slug: String): Boolean
}

class BlogRepositoryImpl : BlogRepository {
    private val dateFormatter = DateTimeFormatter.ofPattern("yyyy年M月d日", Locale.JAPAN)

    override suspend fun findAll(
        limit: Int?,
        tags: List<String>?,
        keyword: String?,
    ): List<BlogResponseDto> =
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
                val escapedKeyword = escapeLikePattern(keyword)
                query.andWhere {
                    (BlogTable.title like "%$escapedKeyword%") or (BlogTable.description like "%$escapedKeyword%")
                }
            }

            query.orderBy(BlogTable.date to SortOrder.DESC)

            val resultQuery = if (limit != null) query.limit(limit) else query
            val resultRows = resultQuery.toList()

            if (resultRows.isEmpty()) return@newSuspendedTransaction emptyList()

            val blogIds = resultRows.map { it[BlogTable.id] }
            val tagsMap =
                (BlogTagsTable innerJoin TagTable)
                    .selectAll()
                    .where { BlogTagsTable.blogId inList blogIds }
                    .groupBy { it[BlogTagsTable.blogId] }
                    .mapValues { entry -> entry.value.map { it[TagTable.name] } }

            resultRows.map { toBlogResponseDto(it, tagsMap[it[BlogTable.id]] ?: emptyList()) }
        }

    override suspend fun findBySlug(slug: String): BlogResponseDto? =
        newSuspendedTransaction {
            val row =
                BlogTable.selectAll().where { BlogTable.slug eq slug }
                    .singleOrNull() ?: return@newSuspendedTransaction null

            val blogId = row[BlogTable.id]
            val tags =
                (BlogTagsTable innerJoin TagTable)
                    .selectAll().where { BlogTagsTable.blogId eq blogId }
                    .map { it[TagTable.name] }

            toBlogResponseDto(row, tags)
        }

    override suspend fun create(blog: BlogRequestDto): BlogResponseDto =
        newSuspendedTransaction {
            val newSlug = SlugGenerator.generate()
            val blogId =
                BlogTable.insert {
                    it[slug] = newSlug
                    it[title] = blog.title
                    it[description] = blog.description
                    it[content] = blog.content
                    it[coverImage] = blog.coverImage
                    it[date] = parseDate(blog.date)
                } get BlogTable.id

            updateTags(blogId, blog.tags)

            BlogResponseDto.fromRequestDto(blog, newSlug)
        }

    override suspend fun update(
        slug: String,
        blog: BlogRequestDto,
    ): BlogResponseDto? =
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

            BlogResponseDto.fromRequestDto(blog, slug)
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

    private fun toBlogResponseDto(
        row: ResultRow,
        tags: List<String>,
    ): BlogResponseDto {
        return BlogResponseDto(
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

    private fun escapeLikePattern(keyword: String): String {
        return keyword
            .replace("\\", "\\\\")
            .replace("%", "\\%")
            .replace("_", "\\_")
    }
}
