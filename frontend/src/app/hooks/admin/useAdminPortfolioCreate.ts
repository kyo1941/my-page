import { useCallback, useState } from "react";
import type { PortfolioUpsertInput } from "@/app/types/portfolio";
import { adminPortfolioRepository } from "@/app/repository/adminPortfolioRepository";

function toJaLongDateFromInput(date: string): string {
  return new Date(date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function useAdminPortfolioCreate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

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
    };

    try {
      await adminPortfolioRepository.create(payload);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create portfolio");
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [title, description, content, coverImage, date]);

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
    },
    state: { isLoading, error },
    actions: { submitCreate },
  };
}
