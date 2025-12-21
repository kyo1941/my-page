import { ApiError, NotFoundError, UnauthorizedError } from "@/app/types/errors";
import type { AdminBlogListItem, Blog, BlogUpsertInput } from "@/app/types/blog";

function getApiUrl(path: string) {
  return path;
}

async function requestOrThrow(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const res = await fetch(input, {
    credentials: "include",
    ...init,
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

async function fetchJsonOrThrow<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await requestOrThrow(input, init);
  return (await res.json()) as T;
}

export class AdminBlogRepository {
  async list(): Promise<AdminBlogListItem[]> {
    return await fetchJsonOrThrow<AdminBlogListItem[]>(getApiUrl("/api/blogs"));
  }

  async get(slug: string): Promise<Blog> {
    return await fetchJsonOrThrow<Blog>(getApiUrl(`/api/blogs/${encodeURIComponent(slug)}`));
  }

  async create(input: BlogUpsertInput): Promise<void> {
    await requestOrThrow(getApiUrl("/api/blogs/post"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  }

  async update(originalSlug: string, input: BlogUpsertInput): Promise<void> {
    await requestOrThrow(getApiUrl(`/api/blogs/edit/${encodeURIComponent(originalSlug)}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  }

  async delete(slug: string): Promise<void> {
    await requestOrThrow(getApiUrl(`/api/blogs/delete/${encodeURIComponent(slug)}`), {
      method: "DELETE",
    });
  }
}

export const adminBlogRepository = new AdminBlogRepository();
