import "server-only";
import { ogpRepository } from "@/app/repository/ogpRepository";
import { extractBareUrls } from "@/app/utils/extractBareUrls";

export async function fetchOgpForContent(content: string) {
  const urls = extractBareUrls(content);
  return ogpRepository.fetchOgpBatch(urls);
}
