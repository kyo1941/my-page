import { useCallback, useState } from "react";
import type { PortfolioUpsertInput } from "@/app/types/portfolio";
import { adminPortfolioRepository } from "@/app/repository/adminPortfolioRepository";
import {
  getTodayInputDate,
  toJaLongDateFromInput,
} from "@/app/hooks/admin/adminDate";

export function useAdminPortfolioCreate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [date, setDate] = useState(getTodayInputDate());
  const [isDraft, setIsDraft] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const submitCreate = useCallback(async () => {
    setIsLoading(true);
    setError("");

    const payload: PortfolioUpsertInput = {
      title,
      description,
      content,
      coverImage,
      date: toJaLongDateFromInput(date),
      isDraft,
    };

    try {
      await adminPortfolioRepository.create(payload);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create portfolio");
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [title, description, content, coverImage, date, isDraft]);

  return {
    form: {
      title,
      setTitle,
      description,
      setDescription,
      content,
      setContent,
      coverImage,
      setCoverImage,
      date,
      setDate,
      isDraft,
      setIsDraft,
    },
    state: { isLoading, error },
    actions: { submitCreate },
  };
}
