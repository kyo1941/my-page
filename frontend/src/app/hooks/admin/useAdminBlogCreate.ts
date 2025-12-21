import { useCallback, useState } from "react";
import type { BlogUpsertInput } from "@/app/types/blog";
import { adminBlogRepository } from "@/app/repository/adminBlogRepository";

function toJaLongDateFromInput(date: string): string {
  return new Date(date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function useAdminBlogCreate() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const submitCreate = useCallback(async () => {
    setIsLoading(true);
    setError("");

    const payload: BlogUpsertInput = {
      title,
      slug,
      description,
      content,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      coverImage,
      date: toJaLongDateFromInput(date),
    };

    try {
      await adminBlogRepository.create(payload);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create blog");
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [title, slug, description, content, tags, coverImage, date]);

  return {
    form: {
      title,
      setTitle,
      slug,
      setSlug,
      description,
      setDescription,
      content,
      setContent,
      tags,
      setTags,
      coverImage,
      setCoverImage,
      date,
      setDate,
    },
    state: { isLoading, error },
    actions: { submitCreate },
  };
}
