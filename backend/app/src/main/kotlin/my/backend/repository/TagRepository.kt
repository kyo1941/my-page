package my.backend.repository

import my.backend.db.schema.TagTable
import my.backend.dto.TagOrderItem
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

    suspend fun updateOrders(orders: List<TagOrderItem>)
}

class TagRepositoryImpl : TagRepository {
    override suspend fun findAll(): List<TagResponseDto> =
        newSuspendedTransaction {
            TagTable.selectAll()
                .orderBy(TagTable.displayOrder to SortOrder.ASC)
                .map { TagResponseDto(it[TagTable.id], it[TagTable.name], it[TagTable.displayOrder]) }
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
                .any()
        }

    override suspend fun create(name: String): TagResponseDto =
        newSuspendedTransaction {
            val nextOrder = (TagTable.selectAll().maxOfOrNull { it[TagTable.displayOrder] }?.plus(1)) ?: 0
            val id =
                TagTable.insert {
                    it[TagTable.name] = name
                    it[TagTable.displayOrder] = nextOrder
                } get TagTable.id
            TagResponseDto(id, name, nextOrder)
        }

    override suspend fun update(
        id: Int,
        name: String,
    ): TagResponseDto? =
        newSuspendedTransaction {
            val row =
                TagTable.selectAll()
                    .where { TagTable.id eq id }
                    .firstOrNull() ?: return@newSuspendedTransaction null
            val currentOrder = row[TagTable.displayOrder]
            TagTable.update({ TagTable.id eq id }) {
                it[TagTable.name] = name
            }
            TagResponseDto(id, name, currentOrder)
        }

    override suspend fun delete(id: Int): Boolean =
        newSuspendedTransaction {
            TagTable.deleteWhere { TagTable.id eq id } > 0
        }

    override suspend fun updateOrders(orders: List<TagOrderItem>) =
        newSuspendedTransaction {
            for (item in orders) {
                TagTable.update({ TagTable.id eq item.id }) {
                    it[TagTable.displayOrder] = item.displayOrder
                }
            }
        }
}
