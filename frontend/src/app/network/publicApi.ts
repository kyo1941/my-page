import { ApiError, NotFoundError } from "@/app/types/errors";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export async function fetchJsonOrNull<T>(
  url: string,
  init?: RequestInit,
): Promise<T | null> {
  try {
    const res = await fetch(url, init);
    if (!res.ok) {
      console.error(`Failed to fetch from API: ${res.status} for ${url}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    return null;
  }
}

export async function requestOrThrow(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const res = await fetch(input, init);
  if (res.status === 404) throw new NotFoundError("Not found");
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(text || `Request failed: ${res.status}`, res.status);
  }
  return res;
}
