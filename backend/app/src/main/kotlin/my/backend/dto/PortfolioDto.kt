package my.backend.dto

import kotlinx.serialization.Serializable

/**
 * ポートフォリオ作成・更新時のリクエストボディを表すDTO
 * スラッグはサーバー側で生成またはURLパスから取得するため、このDTOには含まれない
 */
@Serializable
data class PortfolioRequestDto(
    val title: String,
    val date: String,
    val description: String,
    val coverImage: String? = null,
    val content: String,
)

/**
 * ポートフォリオ情報のレスポンスを表すDTO
 * クライアントへの返却に必要な全ての情報を含む
 */
@Serializable
data class PortfolioResponseDto(
    val slug: String,
    val title: String,
    val date: String,
    val description: String,
    val coverImage: String? = null,
    val content: String,
) {
    companion object {
        fun fromRequestDto(
            request: PortfolioRequestDto,
            slug: String,
        ): PortfolioResponseDto {
            return PortfolioResponseDto(
                slug = slug,
                title = request.title,
                date = request.date,
                description = request.description,
                coverImage = request.coverImage,
                content = request.content,
            )
        }
    }
}
