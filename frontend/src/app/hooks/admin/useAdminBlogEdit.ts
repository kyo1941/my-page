import { useCallback, useEffect, useRef, useState } from "react";
import type { Blog, BlogUpsertInput } from "@/app/types/blog";
import { adminBlogRepository } from "@/app/repository/adminBlogRepository";
import { UnauthorizedError } from "@/app/types/errors";
import {
  toInputDateStringFromJaDate,
  toJaLongDateFromInput,
} from "@/app/hooks/admin/adminDate";

export function useAdminBlogEdit(
  originalSlug: string | undefined,
  { onUnauthorized }: { onUnauthorized?: () => void } = {},
) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [date, setDate] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const onUnauthorizedRef = useRef(onUnauthorized);
  useEffect(() => {
    onUnauthorizedRef.current = onUnauthorized;
  }, [onUnauthorized]);

  useEffect(() => {
    if (!originalSlug) return;

    let cancelled = false;
    const fetchBlog = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data: Blog = await adminBlogRepository.get(originalSlug);
        if (cancelled) return;
        setTitle(data.title);
        setDescription(data.description);
        setContent(data.content);
        setTags(data.tags || []);
        setDate(toInputDateStringFromJaDate(data.date));
      } catch (e) {
        if (cancelled) return;
        if (e instanceof UnauthorizedError) {
          onUnauthorizedRef.current?.();
          return;
        }
        setError(e instanceof Error ? e.message : "Failed to fetch blog");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchBlog();
    return () => {
      cancelled = true;
    };
  }, [originalSlug]);

  const toggleTag = useCallback((tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }, []);

  const buildPayload = useCallback((): BlogUpsertInput => {
    return {
      title,
      description,
      content,
      tags,
      date: toJaLongDateFromInput(date),
    };
  }, [title, description, content, tags, date]);

  const submitUpdate = useCallback(async () => {
    if (!originalSlug) {
      throw new Error("Missing slug");
    }
    setIsLoading(true);
    setError("");
    try {
      await adminBlogRepository.update(originalSlug, buildPayload());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update blog");
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [originalSlug, buildPayload]);

  return {
    form: {
      title,
      setTitle,
      description,
      setDescription,
      content,
      setContent,
      tags,
      toggleTag,
      date,
      setDate,
    },
    state: { isLoading, error },
    actions: { submitUpdate },
  };
}
