import { useCallback, useState } from "react";
import type { BlogUpsertInput } from "@/app/types/blog";
import { adminBlogRepository } from "@/app/repository/adminBlogRepository";
import {
  getTodayInputDate,
  toJaLongDateFromInput,
} from "@/app/hooks/admin/adminDate";

export function useAdminBlogCreate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [date, setDate] = useState(getTodayInputDate());
  const [isDraft, setIsDraft] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const toggleTag = useCallback((tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }, []);

  const submitCreate = useCallback(async () => {
    setIsLoading(true);
    setError("");

    const payload: BlogUpsertInput = {
      title,
      description,
      content,
      tags,
      date: toJaLongDateFromInput(date),
      isDraft,
    };

    try {
      await adminBlogRepository.create(payload);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create blog");
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [title, description, content, tags, date, isDraft]);

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
      isDraft,
      setIsDraft,
    },
    state: { isLoading, error },
    actions: { submitCreate },
  };
}
