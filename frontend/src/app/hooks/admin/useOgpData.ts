"use client";

import { useEffect, useState } from "react";
import type { OgpData } from "@/app/types/ogp";
import { API_BASE_URL } from "@/app/network/publicApi";
import { extractBareUrls } from "@/app/utils/extractBareUrls";

export function useOgpData(content: string): Record<string, OgpData> {
  const [ogpData, setOgpData] = useState<Record<string, OgpData>>({});

  useEffect(() => {
    const urls = extractBareUrls(content);
    if (urls.length === 0) return;

    const missing = urls.filter((u) => !(u in ogpData));
    if (missing.length === 0) return;

    let cancelled = false;

    Promise.all(
      missing.map(async (url) => {
        try {
          const res = await fetch(
            `${API_BASE_URL}/api/ogp?url=${encodeURIComponent(url)}`,
          );
          if (!res.ok) return null;
          const data: OgpData = await res.json();
          return [url, data] as const;
        } catch {
          return null;
        }
      }),
    ).then((results) => {
      if (cancelled) return;
      const newEntries = results.filter(
        (r): r is [string, OgpData] => r !== null,
      );
      if (newEntries.length > 0) {
        setOgpData((prev) => ({ ...prev, ...Object.fromEntries(newEntries) }));
      }
    });

    return () => {
      cancelled = true;
    };
    // ogpData は意図的にdepsから除外 (セッションキャッシュとして機能させる)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  return ogpData;
}
