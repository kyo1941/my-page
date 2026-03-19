import { useCallback, useEffect, useRef, useState } from "react";
import {
  adminTagRepository,
  type Tag,
} from "@/app/repository/adminTagRepository";
import { UnauthorizedError } from "@/app/types/errors";

export function useAdminTags({
  onUnauthorized,
}: { onUnauthorized?: () => void } = {}) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const onUnauthorizedRef = useRef(onUnauthorized);
  useEffect(() => {
    onUnauthorizedRef.current = onUnauthorized;
  }, [onUnauthorized]);

  useEffect(() => {
    let cancelled = false;
    const fetchTags = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await adminTagRepository.list();
        if (!cancelled) setTags(data);
      } catch (e) {
        if (cancelled) return;
        if (e instanceof UnauthorizedError) {
          onUnauthorizedRef.current?.();
          return;
        }
        setError(e instanceof Error ? e.message : "Failed to fetch tags");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchTags();
    return () => {
      cancelled = true;
    };
  }, []);

  const createTag = useCallback(async (name: string) => {
    const created = await adminTagRepository.create(name);
    setTags((prev) =>
      [...prev, created].sort((a, b) => a.displayOrder - b.displayOrder),
    );
  }, []);

  const updateTag = useCallback(async (id: number, name: string) => {
    const updated = await adminTagRepository.update(id, name);
    setTags((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }, []);

  const deleteTag = useCallback(async (id: number) => {
    await adminTagRepository.delete(id);
    setTags((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    state: { tags, isLoading, error },
    actions: { createTag, updateTag, deleteTag },
  };
}
