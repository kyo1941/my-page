import { ApiError, NotFoundError, UnauthorizedError } from "@/app/types/errors";
export { API_BASE_URL } from "@/app/network/publicApi";

export async function requestOrThrow(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const res = await fetch(input, {
    ...init,
    credentials: "include",
  });

  if (res.status === 401) {
    throw new UnauthorizedError("Unauthorized");
  }
  if (res.status === 404) {
    throw new NotFoundError("Not found");
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(text || `Request failed: ${res.status}`, res.status);
  }

  return res;
}

export async function fetchJsonOrThrow<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const res = await requestOrThrow(input, init);
  return (await res.json()) as T;
}
