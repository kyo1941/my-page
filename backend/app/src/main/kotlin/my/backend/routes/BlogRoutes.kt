package my.backend.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import my.backend.dto.BlogDto
import my.backend.service.BlogService

fun Route.blogRoutes(blogService: BlogService) {
    route("/api/blogs") {
        get {
            val limit = call.request.queryParameters["limit"]?.toIntOrNull()
            val tags = call.request.queryParameters.getAll("tags")
            val keyword = call.request.queryParameters["keyword"]

            val blogs = blogService.getBlogs(limit, tags, keyword)
            call.respond(blogs)
        }

        get("/{slug}") {
            val slug = call.parameters["slug"] ?: return@get call.respond(HttpStatusCode.BadRequest)
            val blog = blogService.getBlogBySlug(slug)
            if (blog != null) {
                call.respond(blog)
            } else {
                call.respond(HttpStatusCode.NotFound)
            }
        }

        authenticate("auth-jwt") {
            post {
                val blog = call.receive<BlogDto>()
                val created = blogService.createBlog(blog)
                call.respond(HttpStatusCode.Created, created)
            }

            put("/{slug}") {
                val slug = call.parameters["slug"] ?: return@put call.respond(HttpStatusCode.BadRequest)
                val blog = call.receive<BlogDto>()
                val updated = blogService.updateBlog(slug, blog)
                if (updated != null) {
                    call.respond(updated)
                } else {
                    call.respond(HttpStatusCode.NotFound)
                }
            }

            delete("/{slug}") {
                val slug = call.parameters["slug"] ?: return@delete call.respond(HttpStatusCode.BadRequest)
                val deleted = blogService.deleteBlog(slug)
                if (deleted) {
                    call.respond(HttpStatusCode.NoContent)
                } else {
                    call.respond(HttpStatusCode.NotFound)
                }
            }
        }
    }
}
