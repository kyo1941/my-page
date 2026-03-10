import { useCallback, useEffect, useRef, useState } from "react";
import type { Portfolio, PortfolioUpsertInput } from "@/app/types/portfolio";
import { adminPortfolioRepository } from "@/app/repository/adminPortfolioRepository";
import { UnauthorizedError } from "@/app/types/errors";

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

export function useAdminPortfolioEdit(
  originalSlug: string | undefined,
  { onUnauthorized }: { onUnauthorized?: () => void } = {},
) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
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
    const fetchPortfolio = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data: Portfolio = await adminPortfolioRepository.get(originalSlug);
        if (cancelled) return;
        setTitle(data.title);
        setDescription(data.description);
        setContent(data.content);
        setCoverImage(data.coverImage || "");
        setDate(toInputDateStringFromJaDate(data.date));
      } catch (e) {
        if (cancelled) return;
        if (e instanceof UnauthorizedError) {
          onUnauthorizedRef.current?.();
          return;
        }
        setError(
          e instanceof Error ? e.message : "Failed to fetch portfolio",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchPortfolio();
    return () => {
      cancelled = true;
    };
  }, [originalSlug]);

  const buildPayload = useCallback((): PortfolioUpsertInput => {
    return {
      title,
      description,
      content,
      coverImage,
      date: toJaLongDateFromInput(date),
    };
  }, [title, description, content, coverImage, date]);

  const submitUpdate = useCallback(async () => {
    if (!originalSlug) {
      throw new Error("Missing slug");
    }
    setIsLoading(true);
    setError("");
    try {
      await adminPortfolioRepository.update(originalSlug, buildPayload());
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to update portfolio",
      );
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
      coverImage,
      setCoverImage,
      date,
      setDate,
    },
    state: { isLoading, error },
    actions: { submitUpdate },
  };
}
