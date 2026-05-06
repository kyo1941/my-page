import { useCallback, useEffect, useState } from "react";
import type { BlogUpsertInput } from "@/app/types/blog";
import { adminBlogRepository } from "@/app/repository/adminBlogRepository";
import {
  getTodayInputDate,
  toJaLongDateFromInput,
} from "@/app/hooks/admin/adminDate";
import {
  type AdminBlogRestorePayload,
  clearBlogRestore,
  isFreshBlogRestore,
  readBlogRestore,
} from "@/app/utils/adminBlogRestore";

const RESTORE_MESSAGE = "セッション切れ前の入力内容を復元しました";

export function useAdminBlogCreate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [date, setDate] = useState(getTodayInputDate());
  const [isDraft, setIsDraft] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [restoreMessage, setRestoreMessage] = useState("");

  const applyRestore = useCallback((payload: AdminBlogRestorePayload) => {
    setTitle(payload.title);
    setDescription(payload.description);
    setContent(payload.content);
    setTags(payload.tags);
    setDate(payload.date);
    setIsDraft(payload.isDraft);
    setRestoreMessage(RESTORE_MESSAGE);
  }, []);

  useEffect(() => {
    const restore = readBlogRestore();
    if (!restore) return;

    if (!isFreshBlogRestore(restore)) {
      clearBlogRestore();
      return;
    }

    if (restore.kind !== "blog:create") return;

    applyRestore(restore.payload);
    clearBlogRestore();
  }, [applyRestore]);

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
    state: { isLoading, error, restoreMessage },
    actions: { submitCreate },
  };
}
