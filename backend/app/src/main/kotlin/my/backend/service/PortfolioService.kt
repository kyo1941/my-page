package my.backend.service

import my.backend.dto.PortfolioRequestDto
import my.backend.dto.PortfolioResponseDto
import my.backend.repository.PortfolioRepository

class PortfolioService(private val portfolioRepository: PortfolioRepository) {
    suspend fun getPortfolios(limit: Int?): List<PortfolioResponseDto> {
        return portfolioRepository.findAll(limit)
    }

    suspend fun getPortfolioBySlug(slug: String): PortfolioResponseDto? {
        return portfolioRepository.findBySlug(slug)
    }

    suspend fun createPortfolio(portfolio: PortfolioRequestDto): PortfolioResponseDto {
        return portfolioRepository.create(portfolio)
    }

    suspend fun updatePortfolio(
        slug: String,
        portfolio: PortfolioRequestDto,
    ): PortfolioResponseDto? {
        return portfolioRepository.update(slug, portfolio)
    }

    suspend fun deletePortfolio(slug: String): Boolean {
        return portfolioRepository.delete(slug)
    }
}
