package my.backend.repository

import my.backend.db.schema.PortfolioTable
import my.backend.db.schema.PortfolioTagNameTable
import my.backend.db.schema.PortfolioTagsTable
import my.backend.dto.PortfolioRequestDto
import my.backend.dto.PortfolioResponseDto
import my.backend.util.SlugGenerator
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.Locale

interface PortfolioRepository {
    suspend fun findAll(
        limit: Int? = null,
        tags: List<String>? = null,
        keyword: String? = null,
    ): List<PortfolioResponseDto>

    suspend fun findBySlug(slug: String): PortfolioResponseDto?

    suspend fun create(portfolio: PortfolioRequestDto): PortfolioResponseDto

    suspend fun update(
        slug: String,
        portfolio: PortfolioRequestDto,
    ): PortfolioResponseDto?

    suspend fun delete(slug: String): Boolean
}

class PortfolioRepositoryImpl : PortfolioRepository {
    private val dateFormatter = DateTimeFormatter.ofPattern("yyyy年M月d日", Locale.JAPAN)

    override suspend fun findAll(
        limit: Int?,
        tags: List<String>?,
        keyword: String?,
    ): List<PortfolioResponseDto> =
        newSuspendedTransaction {
            val query = PortfolioTable.selectAll()

            if (!tags.isNullOrEmpty()) {
                val portfolioIdsWithTags =
                    (PortfolioTagsTable innerJoin PortfolioTagNameTable)
                        .selectAll().where { PortfolioTagNameTable.name inList tags }
                        .map { it[PortfolioTagsTable.portfolioId] }

                query.andWhere { PortfolioTable.id inList portfolioIdsWithTags }
            }

            if (!keyword.isNullOrBlank()) {
                val escapedKeyword = escapeLikePattern(keyword)
                query.andWhere {
                    (PortfolioTable.title like "%$escapedKeyword%") or
                        (PortfolioTable.description like "%$escapedKeyword%")
                }
            }

            query.orderBy(PortfolioTable.date to SortOrder.DESC)

            val resultQuery = if (limit != null) query.limit(limit) else query
            val resultRows = resultQuery.toList()

            if (resultRows.isEmpty()) return@newSuspendedTransaction emptyList()

            val portfolioIds = resultRows.map { it[PortfolioTable.id] }
            val tagsMap =
                (PortfolioTagsTable innerJoin PortfolioTagNameTable)
                    .selectAll()
                    .where { PortfolioTagsTable.portfolioId inList portfolioIds }
                    .groupBy { it[PortfolioTagsTable.portfolioId] }
                    .mapValues { entry -> entry.value.map { it[PortfolioTagNameTable.name] } }

            resultRows.map { toPortfolioResponseDto(it, tagsMap[it[PortfolioTable.id]] ?: emptyList()) }
        }

    override suspend fun findBySlug(slug: String): PortfolioResponseDto? =
        newSuspendedTransaction {
            val row =
                PortfolioTable.selectAll().where { PortfolioTable.slug eq slug }
                    .singleOrNull() ?: return@newSuspendedTransaction null

            val portfolioId = row[PortfolioTable.id]
            val tags =
                (PortfolioTagsTable innerJoin PortfolioTagNameTable)
                    .selectAll().where { PortfolioTagsTable.portfolioId eq portfolioId }
                    .map { it[PortfolioTagNameTable.name] }

            toPortfolioResponseDto(row, tags)
        }

    override suspend fun create(portfolio: PortfolioRequestDto): PortfolioResponseDto =
        newSuspendedTransaction {
            val newSlug = SlugGenerator.generate()
            val portfolioId =
                PortfolioTable.insert {
                    it[slug] = newSlug
                    it[title] = portfolio.title
                    it[description] = portfolio.description
                    it[content] = portfolio.content
                    it[coverImage] = portfolio.coverImage
                    it[date] = parseDate(portfolio.date)
                } get PortfolioTable.id

            updateTags(portfolioId, portfolio.tags)

            PortfolioResponseDto.fromRequestDto(portfolio, newSlug)
        }

    override suspend fun update(
        slug: String,
        portfolio: PortfolioRequestDto,
    ): PortfolioResponseDto? =
        newSuspendedTransaction {
            val existing =
                PortfolioTable.selectAll().where { PortfolioTable.slug eq slug }
                    .singleOrNull() ?: return@newSuspendedTransaction null
            val id = existing[PortfolioTable.id]

            PortfolioTable.update({ PortfolioTable.id eq id }) {
                it[title] = portfolio.title
                it[description] = portfolio.description
                it[content] = portfolio.content
                it[coverImage] = portfolio.coverImage
                it[date] = parseDate(portfolio.date)
            }

            updateTags(id, portfolio.tags)

            PortfolioResponseDto.fromRequestDto(portfolio, slug)
        }

    override suspend fun delete(slug: String): Boolean =
        newSuspendedTransaction {
            val existing =
                PortfolioTable.selectAll().where { PortfolioTable.slug eq slug }
                    .singleOrNull() ?: return@newSuspendedTransaction false
            val id = existing[PortfolioTable.id]

            PortfolioTagsTable.deleteWhere { portfolioId eq id }

            PortfolioTable.deleteWhere { PortfolioTable.id eq id } > 0
        }

    private fun toPortfolioResponseDto(
        row: ResultRow,
        tags: List<String>,
    ): PortfolioResponseDto {
        return PortfolioResponseDto(
            slug = row[PortfolioTable.slug],
            title = row[PortfolioTable.title],
            date = row[PortfolioTable.date].format(dateFormatter),
            description = row[PortfolioTable.description],
            coverImage = row[PortfolioTable.coverImage],
            tags = tags,
            content = row[PortfolioTable.content],
        )
    }

    private fun updateTags(
        portfolioId: Int,
        tags: List<String>,
    ) {
        PortfolioTagsTable.deleteWhere { PortfolioTagsTable.portfolioId eq portfolioId }

        if (tags.isEmpty()) return

        PortfolioTagNameTable.batchInsert(tags, ignore = true) { tagName ->
            this[PortfolioTagNameTable.name] = tagName
        }

        val tagIds =
            PortfolioTagNameTable.selectAll()
                .where { PortfolioTagNameTable.name inList tags }
                .map { it[PortfolioTagNameTable.id] }

        PortfolioTagsTable.batchInsert(tagIds) { tagId ->
            this[PortfolioTagsTable.portfolioId] = portfolioId
            this[PortfolioTagsTable.tagId] = tagId
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
