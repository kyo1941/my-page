package my.backend.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import my.backend.service.OgpService

fun Route.ogpRoutes(ogpService: OgpService) {
    route("/api/ogp") {
        get {
            val rawUrl =
                call.request.queryParameters["url"]
                    ?: return@get call.respond(HttpStatusCode.BadRequest, "url is required")
            val result =
                ogpService.fetchOgp(rawUrl)
                    ?: return@get call.respond(HttpStatusCode.NotFound)
            call.respond(result)
        }
    }
}
