const URL_REGEX = /^https?:\/\/\S+$/;

export function extractBareUrls(markdown: string): string[] {
  const urls: string[] = [];
  for (const line of markdown.split("\n")) {
    const trimmed = line.trim();
    if (URL_REGEX.test(trimmed)) urls.push(trimmed);
  }
  return [...new Set(urls)];
}
