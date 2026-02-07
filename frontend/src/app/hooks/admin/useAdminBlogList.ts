import { useCallback, useEffect, useState } from "react";
import type { AdminBlogListItem } from "@/app/types/blog";
import { adminBlogRepository } from "@/app/repository/adminBlogRepository";

export function useAdminBlogList() {
  const [blogs, setBlogs] = useState<AdminBlogListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const reload = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError("");
    try {
      const data: AdminBlogListItem[] = await adminBlogRepository.list();
      setBlogs(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch blogs");
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const deleteBlog = useCallback(
    async (slug: string): Promise<void> => {
      setIsLoading(true);
      setError("");
      try {
        await adminBlogRepository.delete(slug);
        await reload();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to delete blog");
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [reload],
  );

  return {
    state: { blogs, isLoading, error },
    actions: { reload, deleteBlog },
  };
}
