package my.backend

import io.ktor.server.application.*
import io.ktor.server.netty.*
import my.backend.db.DatabaseFactory
import my.backend.plugins.*

fun main(args: Array<String>): Unit = EngineMain.main(args)

fun Application.module() {
    DatabaseFactory.init()

    configureKoin()
    configureSerialization()
    configureHTTP()
    configureValidation()
    configureStatusPages()
    configureRouting()
}
