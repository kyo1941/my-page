import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  adminTagRepository,
  type Tag,
} from "@/app/repository/adminTagRepository";
import { UnauthorizedError } from "@/app/types/errors";
import { useAdminTags } from "./useAdminTags";

export function useAdminTagOrder() {
  const router = useRouter();
  const { state } = useAdminTags({
    onUnauthorized: () => router.push("/admin/login"),
  });

  const [orderedTags, setOrderedTags] = useState<Tag[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!state.isLoading && state.tags.length > 0) {
      setOrderedTags(state.tags);
    }
  }, [state.tags, state.isLoading]);

  const isDirty =
    orderedTags.length > 0 &&
    orderedTags.some((tag, i) => tag.id !== state.tags[i]?.id);

  const confirmOrder = useCallback(async () => {
    setIsSubmitting(true);
    setError("");
    try {
      const orders = orderedTags.map((tag, i) => ({
        id: tag.id,
        displayOrder: i,
      }));
      await adminTagRepository.reorder(orders);
      router.push("/admin");
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        router.push("/admin/login");
        return;
      }
      setError(e instanceof Error ? e.message : "Failed to reorder tags");
    } finally {
      setIsSubmitting(false);
    }
  }, [orderedTags, router]);

  return {
    state: {
      orderedTags,
      isLoading: state.isLoading,
      isSubmitting,
      isDirty,
      error: error || state.error,
    },
    actions: { setOrderedTags, confirmOrder },
  };
}
