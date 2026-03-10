import { useCallback, useEffect, useRef, useState } from "react";
import type { AdminPortfolioListItem } from "@/app/types/portfolio";
import { adminPortfolioRepository } from "@/app/repository/adminPortfolioRepository";
import { UnauthorizedError } from "@/app/types/errors";

type Options = {
  onUnauthorized?: () => void;
};

export function useAdminPortfolioList({ onUnauthorized }: Options = {}) {
  const [portfolios, setPortfolios] = useState<AdminPortfolioListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const onUnauthorizedRef = useRef(onUnauthorized);
  useEffect(() => {
    onUnauthorizedRef.current = onUnauthorized;
  }, [onUnauthorized]);

  const reload = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError("");
    try {
      const data: AdminPortfolioListItem[] =
        await adminPortfolioRepository.list();
      setPortfolios(data);
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        onUnauthorizedRef.current?.();
        return;
      }
      setError(e instanceof Error ? e.message : "Failed to fetch portfolios");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const deletePortfolio = useCallback(
    async (slug: string): Promise<void> => {
      setIsLoading(true);
      setError("");
      try {
        await adminPortfolioRepository.delete(slug);
        await reload();
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Failed to delete portfolio",
        );
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [reload],
  );

  return {
    state: { portfolios, isLoading, error },
    actions: { reload, deletePortfolio },
  };
}
