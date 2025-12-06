const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type Portfolio = {
  slug: string;
  title: string;
  date: string;
  description: string;
  coverImage?: string | undefined;
  tags?: string[];
  content: string;
};

export type PortfolioSearchParams = {
  limit?: number;
};

export class PortfolioRepository {
  async getSortedPostsData(
    params?: PortfolioSearchParams,
  ): Promise<Portfolio[]> {
    const searchParams = new URLSearchParams();

    if (params?.limit) {
      searchParams.append("limit", params.limit.toString());
    }

    const queryString = searchParams.toString();
    const url = queryString
      ? `${API_BASE_URL}/api/portfolios?${queryString}`
      : `${API_BASE_URL}/api/portfolios`;
    const portfolios = await fetchApi<Portfolio[]>(url);

    if (portfolios) {
      return portfolios.map((portfolio) => {
        if (portfolio.coverImage && portfolio.coverImage.startsWith("/")) {
          return {
            ...portfolio,
            coverImage: `${API_BASE_URL}${portfolio.coverImage}`,
          };
        }
        return portfolio;
      });
    }

    return [];
  }

  async getAllPostSlugs() {
    const portfolios = await this.getSortedPostsData();

    return portfolios.map((portfolio) => {
      return {
        params: {
          slug: portfolio.slug,
        },
      };
    });
  }

  async getPostData(slug: string): Promise<Portfolio | null> {
    const portfolio = await fetchApi<Portfolio>(
      `${API_BASE_URL}/api/portfolios/${slug}`,
    );
    if (
      portfolio &&
      portfolio.coverImage &&
      portfolio.coverImage.startsWith("/")
    ) {
      portfolio.coverImage = `${API_BASE_URL}${portfolio.coverImage}`;
    }
    return portfolio;
  }
}

async function fetchApi<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Failed to fetch from API: ${res.status} for ${url}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    return null;
  }
}

export const portfolioRepository = new PortfolioRepository();
