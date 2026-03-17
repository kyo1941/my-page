"use client";

import { useEffect, useState } from "react";

export function useCommittedPreview(content: string) {
  const [isComposing, setIsComposing] = useState(false);
  const [previewContent, setPreviewContent] = useState(content);

  useEffect(() => {
    if (isComposing) {
      return;
    }

    setPreviewContent(content);
  }, [content, isComposing]);

  return {
    previewContent,
    onCompositionStart: () => setIsComposing(true),
    onCompositionEnd: (value: string) => {
      setIsComposing(false);
      setPreviewContent(value);
    },
  };
}
