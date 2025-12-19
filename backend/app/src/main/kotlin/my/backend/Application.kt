package my.backend

import io.ktor.server.application.*
import io.ktor.server.netty.*
import my.backend.db.DatabaseFactory
import my.backend.di.appModule
import my.backend.plugins.*
import org.koin.ktor.ext.inject

fun main(args: Array<String>): Unit = EngineMain.main(args)

fun Application.module() {
    configureKoin(listOf(appModule(environment.config)))

    val databaseFactory: DatabaseFactory by inject()
    databaseFactory.init()

    configureSerialization()
    configureHTTP()
    configureValidation()
    configureStatusPages()
    configureRouting()
}
