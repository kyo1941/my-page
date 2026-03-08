package my.backend.repository

import my.backend.db.schema.PortfolioTable
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
    private val dateFormatter = DateTimeFormatter.ofPattern("yyyy年M月d日", Locale.JAPAN)

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
            PortfolioTable.insert {
                it[slug] = newSlug
                it[title] = portfolio.title
                it[description] = portfolio.description
                it[content] = portfolio.content
                it[coverImage] = portfolio.coverImage
                it[date] = parseDate(portfolio.date)
            }

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

            PortfolioResponseDto.fromRequestDto(portfolio, slug)
        }

    override suspend fun delete(slug: String): Boolean =
        newSuspendedTransaction {
            PortfolioTable.deleteWhere { PortfolioTable.slug eq slug } > 0
        }

    private fun toPortfolioResponseDto(row: ResultRow): PortfolioResponseDto {
        return PortfolioResponseDto(
            slug = row[PortfolioTable.slug],
            title = row[PortfolioTable.title],
            date = row[PortfolioTable.date].format(dateFormatter),
            description = row[PortfolioTable.description],
            coverImage = row[PortfolioTable.coverImage],
            content = row[PortfolioTable.content],
        )
    }

    private fun parseDate(dateString: String): LocalDateTime {
        return try {
            LocalDate.parse(dateString, dateFormatter).atStartOfDay()
        } catch (e: Exception) {
            LocalDateTime.now()
        }
    }
}
