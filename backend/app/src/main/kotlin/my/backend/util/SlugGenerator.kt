package my.backend.util

import com.aventrix.jnanoid.jnanoid.NanoIdUtils

object SlugGenerator {
    /**
     * URLセーフな一意のSlugを生成する。
     * デフォルトで12文字のNanoIDを使用。
     */
    fun generate(): String {
        return NanoIdUtils.randomNanoId(
            NanoIdUtils.DEFAULT_NUMBER_GENERATOR,
            NanoIdUtils.DEFAULT_ALPHABET,
            12,
        )
    }
}
