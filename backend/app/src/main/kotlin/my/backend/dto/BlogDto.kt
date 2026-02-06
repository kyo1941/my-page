package my.backend.dto

import kotlinx.serialization.Serializable

/**
 * ブログ記事作成・更新時のリクエストボディを表すDTO
 * スラッグはサーバー側で生成またはURLパスから取得するため、このDTOには含まれない
 *
 * @property title 記事のタイトル
 * @property date 記事の公開日
 * @property description 記事の概要
 * @property coverImage 記事のカバー画像のパスまたはURL（nullable）
 * @property tags 記事に関連付けられたタグのリスト
 * @property content 記事の本文
 */
@Serializable
data class BlogRequestDto(
    val title: String,
    val date: String,
    val description: String,
    val coverImage: String? = null,
    val tags: List<String>,
    val content: String,
)

/**
 * ブログ記事情報のレスポンスを表すDTO
 * クライアントへの返却に必要な全ての情報を含む
 *
 * @property slug 記事を一意に識別するスラッグ（ID）
 * @property title 記事のタイトル
 * @property date 記事の公開日
 * @property description 記事の概要
 * @property coverImage 記事のカバー画像のパスまたはURL（nullable）
 * @property tags 記事に関連付けられたタグのリスト
 * @property content 記事の本文
 */
@Serializable
data class BlogResponseDto(
    val slug: String,
    val title: String,
    val date: String,
    val description: String,
    val coverImage: String? = null,
    val tags: List<String>,
    val content: String,
) {
    companion object {
        fun fromRequestDto(
            request: BlogRequestDto,
            slug: String,
        ): BlogResponseDto {
            return BlogResponseDto(
                slug = slug,
                title = request.title,
                date = request.date,
                description = request.description,
                coverImage = request.coverImage,
                tags = request.tags,
                content = request.content,
            )
        }
    }
}
