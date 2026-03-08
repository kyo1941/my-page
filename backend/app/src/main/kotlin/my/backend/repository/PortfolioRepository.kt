package my.backend.repository

import my.backend.db.schema.PortfolioTable
import my.backend.dto.PortfolioRequestDto
import my.backend.dto.PortfolioResponseDto
import my.backend.util.SlugGenerator
import my.backend.util.formatLocalDateTime
import my.backend.util.parseDateToLocalDateTime
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction

interface PortfolioRepository {
    suspend fun findAll(limit: Int? = null): List<PortfolioResponseDto>

    suspend fun findBySlug(slug: String): PortfolioResponseDto?

    suspend fun create(portfolio: PortfolioRequestDto): PortfolioResponseDto

    suspend fun update(
        slug: String,
        portfolio: PortfolioRequestDto,
    ): PortfolioResponseDto?

    suspend fun delete(slug: String): Boolean
}

class PortfolioRepositoryImpl : PortfolioRepository {
    override suspend fun findAll(limit: Int?): List<PortfolioResponseDto> =
        newSuspendedTransaction {
            val query =
                PortfolioTable.selectAll()
                    .orderBy(PortfolioTable.date to SortOrder.DESC)

            val resultQuery = if (limit != null) query.limit(limit) else query
            resultQuery.map { toPortfolioResponseDto(it) }
        }

    override suspend fun findBySlug(slug: String): PortfolioResponseDto? =
        newSuspendedTransaction {
            PortfolioTable.selectAll().where { PortfolioTable.slug eq slug }
                .singleOrNull()
                ?.let { toPortfolioResponseDto(it) }
        }

    override suspend fun create(portfolio: PortfolioRequestDto): PortfolioResponseDto =
        newSuspendedTransaction {
            val newSlug = SlugGenerator.generate()
            val parsedDate = parseDateToLocalDateTime(portfolio.date)
            PortfolioTable.insert {
                it[slug] = newSlug
                it[title] = portfolio.title
                it[description] = portfolio.description
                it[content] = portfolio.content
                it[coverImage] = portfolio.coverImage
                it[date] = parsedDate
            }

            PortfolioResponseDto(
                slug = newSlug,
                title = portfolio.title,
                date = formatLocalDateTime(parsedDate),
                description = portfolio.description,
                coverImage = portfolio.coverImage,
                content = portfolio.content,
            )
        }

    override suspend fun update(
        slug: String,
        portfolio: PortfolioRequestDto,
    ): PortfolioResponseDto? =
        newSuspendedTransaction {
            val parsedDate = parseDateToLocalDateTime(portfolio.date)
            val updatedRows =
                PortfolioTable.update({ PortfolioTable.slug eq slug }) {
                    it[title] = portfolio.title
                    it[description] = portfolio.description
                    it[content] = portfolio.content
                    it[coverImage] = portfolio.coverImage
                    it[date] = parsedDate
                }

            if (updatedRows > 0) {
                PortfolioResponseDto(
                    slug = slug,
                    title = portfolio.title,
                    date = formatLocalDateTime(parsedDate),
                    description = portfolio.description,
                    coverImage = portfolio.coverImage,
                    content = portfolio.content,
                )
            } else {
                null
            }
        }

    override suspend fun delete(slug: String): Boolean =
        newSuspendedTransaction {
            PortfolioTable.deleteWhere { PortfolioTable.slug eq slug } > 0
        }

    private fun toPortfolioResponseDto(row: ResultRow): PortfolioResponseDto {
        return PortfolioResponseDto(
            slug = row[PortfolioTable.slug],
            title = row[PortfolioTable.title],
            date = formatLocalDateTime(row[PortfolioTable.date]),
            description = row[PortfolioTable.description],
            coverImage = row[PortfolioTable.coverImage],
            content = row[PortfolioTable.content],
        )
    }
}
