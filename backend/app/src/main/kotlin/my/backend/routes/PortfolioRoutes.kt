package my.backend.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import my.backend.service.PortfolioService

fun Route.portfolioRoutes(portfolioService: PortfolioService) {
    route("/api/portfolios") {
        get {
            val limit = call.request.queryParameters["limit"]?.toIntOrNull()
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
}
