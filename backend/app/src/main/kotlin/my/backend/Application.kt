package my.backend

import io.ktor.server.application.*
import io.ktor.server.netty.*
import kotlinx.coroutines.launch
import my.backend.db.DatabaseFactory
import my.backend.di.appModule
import my.backend.plugins.*
import my.backend.repository.UserRepository
import org.koin.ktor.ext.inject
import org.mindrot.jbcrypt.BCrypt

fun main(args: Array<String>): Unit = EngineMain.main(args)

fun Application.module() {
    configureKoin(listOf(appModule(environment.config)))

    val databaseFactory: DatabaseFactory by inject()
    databaseFactory.init()

    val userRepository: UserRepository by inject()
    launch {
        val count = userRepository.count()
        if (count == 0L) {
            val username = environment.config.propertyOrNull("app.admin.username")?.getString() ?: "admin"
            val password = environment.config.propertyOrNull("app.admin.password")?.getString() ?: "admin"
            val hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt())
            userRepository.create(username, hashedPassword)
            log.info("Created default admin user: $username")
        } else {
            log.info("Users already exist (count: $count). Skipping default admin user creation.")
        }
    }

    configureSerialization()
    configureHTTP()
    configureSecurity()
    configureValidation()
    configureStatusPages()
    configureRouting()
}
