import { API_BASE_URL, fetchJsonOrNull } from "@/app/network/publicApi";
import type { OgpData } from "@/app/types/ogp";

class OgpRepository {
  private async fetchOgp(url: string): Promise<OgpData | null> {
    return fetchJsonOrNull<OgpData>(
      `${API_BASE_URL}/api/ogp?url=${encodeURIComponent(url)}`,
    );
  }

  async fetchOgpBatch(urls: string[]): Promise<Record<string, OgpData>> {
    if (urls.length === 0) return {};
    const results = await Promise.all(
      urls.map(async (url) => {
        const data = await this.fetchOgp(url);
        return data ? ([url, data] as const) : null;
      }),
    );
    return Object.fromEntries(
      results.filter((r): r is [string, OgpData] => r !== null),
    );
  }
}

export const ogpRepository = new OgpRepository();
