import { useState, useEffect } from "react";
import {
  Portfolio,
  portfolioRepository,
} from "@/app/repository/portfolioRepository";

export function usePortfolioList() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolios = async () => {
      setIsLoading(true);
      const allPortfolios = await portfolioRepository.getSortedPostsData();
      setPortfolios(allPortfolios);
      setIsLoading(false);
    };
    fetchPortfolios();
  }, []);

  return { portfolios, isLoading };
}
