package my.backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

// --- Main Application ---
@SpringBootApplication 
class Application

fun main(args: Array<String>) {
    runApplication<Application>(*args)
}