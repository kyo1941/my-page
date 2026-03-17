package my.backend.repository

import my.backend.db.schema.TagTable
import my.backend.dto.TagResponseDto
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction

interface TagRepository {
    suspend fun findAll(): List<TagResponseDto>

    suspend fun existsByName(
        name: String,
        excludeId: Int? = null,
    ): Boolean

    suspend fun create(name: String): TagResponseDto

    suspend fun update(
        id: Int,
        name: String,
    ): TagResponseDto?

    suspend fun delete(id: Int): Boolean
}

class TagRepositoryImpl : TagRepository {
    override suspend fun findAll(): List<TagResponseDto> =
        newSuspendedTransaction {
            TagTable.selectAll()
                .orderBy(TagTable.name to SortOrder.ASC)
                .map { TagResponseDto(it[TagTable.id], it[TagTable.name]) }
        }

    override suspend fun existsByName(
        name: String,
        excludeId: Int?,
    ): Boolean =
        newSuspendedTransaction {
            TagTable.selectAll()
                .where {
                    if (excludeId != null) {
                        (TagTable.name eq name) and (TagTable.id neq excludeId)
                    } else {
                        TagTable.name eq name
                    }
                }
                .count() > 0
        }

    override suspend fun create(name: String): TagResponseDto =
        newSuspendedTransaction {
            val id =
                TagTable.insert {
                    it[TagTable.name] = name
                } get TagTable.id
            TagResponseDto(id, name)
        }

    override suspend fun update(
        id: Int,
        name: String,
    ): TagResponseDto? =
        newSuspendedTransaction {
            val updated =
                TagTable.update({ TagTable.id eq id }) {
                    it[TagTable.name] = name
                }
            if (updated == 0) null else TagResponseDto(id, name)
        }

    override suspend fun delete(id: Int): Boolean =
        newSuspendedTransaction {
            TagTable.deleteWhere { TagTable.id eq id } > 0
        }
}
