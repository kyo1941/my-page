package my.backend.util

import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException
import java.util.Locale

private val dateFormatter = DateTimeFormatter.ofPattern("yyyy年M月d日", Locale.JAPAN)

fun parseDateToLocalDateTime(dateString: String): LocalDateTime {
    return try {
        LocalDate.parse(dateString, dateFormatter).atStartOfDay()
    } catch (e: DateTimeParseException) {
        throw IllegalArgumentException("Invalid date format for '$dateString'. Expected format 'yyyy年M月d日'.", e)
    }
}

fun formatLocalDateTime(dateTime: LocalDateTime): String = dateTime.format(dateFormatter)
