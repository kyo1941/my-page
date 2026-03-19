package my.backend.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import my.backend.dto.PortfolioRequestDto
import my.backend.service.PortfolioService

fun Route.portfolioRoutes(portfolioService: PortfolioService) {
    route("/api/portfolios") {
        get {
            val limit = call.request.queryParameters["limit"]?.toIntOrNull() ?: PortfolioService.MAX_LIMIT
            val portfolios = portfolioService.getPortfolios(limit)
            call.respond(portfolios)
        }

        get("/{slug}") {
            val slug = call.parameters["slug"] ?: return@get call.respond(HttpStatusCode.BadRequest)
            val portfolio = portfolioService.getPortfolioBySlug(slug)
            if (portfolio != null) {
                call.respond(portfolio)
            } else {
                call.respond(HttpStatusCode.NotFound)
            }
        }
    }

    authenticate("auth-jwt") {
        route("/api/admin/portfolios") {
            get {
                val limit = call.request.queryParameters["limit"]?.toIntOrNull() ?: PortfolioService.MAX_LIMIT
                val portfolios = portfolioService.getPortfolios(limit, includeDrafts = true)
                call.respond(portfolios)
            }

            post {
                val portfolio = call.receive<PortfolioRequestDto>()
                val created = portfolioService.createPortfolio(portfolio)
                call.respond(HttpStatusCode.Created, created)
            }

            put("/{slug}") {
                val slug = call.parameters["slug"] ?: return@put call.respond(HttpStatusCode.BadRequest)
                val portfolio = call.receive<PortfolioRequestDto>()
                val updated = portfolioService.updatePortfolio(slug, portfolio)
                if (updated != null) {
                    call.respond(updated)
                } else {
                    call.respond(HttpStatusCode.NotFound)
                }
            }

            delete("/{slug}") {
                val slug = call.parameters["slug"] ?: return@delete call.respond(HttpStatusCode.BadRequest)
                val deleted = portfolioService.deletePortfolio(slug)
                if (deleted) {
                    call.respond(HttpStatusCode.NoContent)
                } else {
                    call.respond(HttpStatusCode.NotFound)
                }
            }
        }
    }
}
