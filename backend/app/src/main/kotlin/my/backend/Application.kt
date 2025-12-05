package my.backend

import io.ktor.server.application.*
import io.ktor.server.netty.*
import my.backend.plugins.*

fun main(args: Array<String>): Unit = EngineMain.main(args)

fun Application.module() {
    configureKoin()
    configureSerialization()
    configureHTTP()
    configureValidation()
    configureStatusPages()
    configureRouting()
}
