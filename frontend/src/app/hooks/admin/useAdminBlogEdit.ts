import { useCallback, useEffect, useState } from "react";
import type { Blog, BlogUpsertInput } from "@/app/types/blog";
import { adminBlogRepository } from "@/app/repository/adminBlogRepository";

function toInputDateStringFromJaDate(dateText: string): string {
  // "yyyy年M月d日" -> "yyyy-MM-dd"
  const match = dateText.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (!match) return "";
  const [, y, m, d] = match;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function toJaLongDateFromInput(date: string): string {
  return new Date(date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function useAdminBlogEdit(originalSlug: string | undefined) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [date, setDate] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

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
        setSlug(data.slug);
        setDescription(data.description);
        setContent(data.content);
        setTags((data.tags || []).join(", "));
        setCoverImage(data.coverImage || "");
        setDate(toInputDateStringFromJaDate(data.date));
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to fetch blog");
      } finally {
        // finally内のreturnはTS警告になるので避ける
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

  const buildPayload = useCallback((): BlogUpsertInput => {
    return {
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
  }, [title, slug, description, content, tags, coverImage, date]);

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
    state: {
      isLoading,
      error,
    },
    actions: {
      submitUpdate,
    },
  };
}
