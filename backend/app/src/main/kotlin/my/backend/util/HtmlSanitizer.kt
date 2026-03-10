package my.backend.util

import org.jsoup.Jsoup
import org.jsoup.safety.Safelist

/**
 * 文字列からすべてのHTMLタグおよびHTMLエンティティを除去する。
 * title / description のようなプレーンテキストフィールドの XSS 対策として使用する。
 * content（Markdown）フィールドは対象外とし、フロントエンド側でのサニタイズに委ねる。
 */
fun String.stripHtmlTags(): String = Jsoup.clean(this, Safelist.none())
