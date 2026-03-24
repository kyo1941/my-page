import type {
  AdminPortfolioListItem,
  Portfolio,
  PortfolioUpsertInput,
} from "@/app/types/portfolio";
import {
  requestOrThrow,
  fetchJsonOrThrow,
  API_BASE_URL,
  ADMIN_API_BASE,
} from "@/app/network/adminApi";

class AdminPortfolioRepository {
  async list(): Promise<AdminPortfolioListItem[]> {
    return await fetchJsonOrThrow<AdminPortfolioListItem[]>(
      `${ADMIN_API_BASE}/portfolios`,
    );
  }

  async get(slug: string): Promise<Portfolio> {
    return await fetchJsonOrThrow<Portfolio>(
      `${API_BASE_URL}/api/portfolios/${encodeURIComponent(slug)}`,
    );
  }

  async create(input: PortfolioUpsertInput): Promise<void> {
    await requestOrThrow(`${ADMIN_API_BASE}/portfolios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  }

  async update(
    originalSlug: string,
    input: PortfolioUpsertInput,
  ): Promise<void> {
    await requestOrThrow(
      `${ADMIN_API_BASE}/portfolios/${encodeURIComponent(originalSlug)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      },
    );
  }

  async delete(slug: string): Promise<void> {
    await requestOrThrow(
      `${ADMIN_API_BASE}/portfolios/${encodeURIComponent(slug)}`,
      {
        method: "DELETE",
      },
    );
  }
}

export const adminPortfolioRepository = new AdminPortfolioRepository();
