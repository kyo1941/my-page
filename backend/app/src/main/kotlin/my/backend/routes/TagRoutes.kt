package my.backend.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import my.backend.dto.TagReorderRequestDto
import my.backend.dto.TagRequestDto
import my.backend.service.TagService

fun Route.tagRoutes(tagService: TagService) {
    get("/api/tags") {
        call.respond(tagService.getTags())
    }

    authenticate("auth-jwt") {
        route("/api/admin/tags") {
            post {
                val request = call.receive<TagRequestDto>()
                val created = tagService.createTag(request.name)
                call.respond(HttpStatusCode.Created, created)
            }

            put("/order") {
                val request = call.receive<TagReorderRequestDto>()
                tagService.reorderTags(request.orders)
                call.respond(HttpStatusCode.OK)
            }

            put("/{id}") {
                val id =
                    call.parameters["id"]?.toIntOrNull()
                        ?: return@put call.respond(HttpStatusCode.BadRequest)
                val request = call.receive<TagRequestDto>()
                val updated = tagService.updateTag(id, request.name)
                if (updated != null) {
                    call.respond(updated)
                } else {
                    call.respond(HttpStatusCode.NotFound)
                }
            }

            delete("/{id}") {
                val id =
                    call.parameters["id"]?.toIntOrNull()
                        ?: return@delete call.respond(HttpStatusCode.BadRequest)
                val deleted = tagService.deleteTag(id)
                if (deleted) {
                    call.respond(HttpStatusCode.NoContent)
                } else {
                    call.respond(HttpStatusCode.NotFound)
                }
            }
        }
    }
}
