import type {
  AdminBlogListItem,
  Blog,
  BlogUpsertInput,
} from "@/app/types/blog";
import { requestOrThrow, fetchJsonOrThrow, API_BASE_URL } from "@/app/network/adminApi";

class AdminBlogRepository {
  async list(): Promise<AdminBlogListItem[]> {
    return await fetchJsonOrThrow<AdminBlogListItem[]>(`${API_BASE_URL}/api/admin/blogs`);
  }

  async get(slug: string): Promise<Blog> {
    return await fetchJsonOrThrow<Blog>(
      `${API_BASE_URL}/api/blogs/${encodeURIComponent(slug)}`,
    );
  }

  async create(input: BlogUpsertInput): Promise<void> {
    await requestOrThrow(`${API_BASE_URL}/api/admin/blogs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  }

  async update(originalSlug: string, input: BlogUpsertInput): Promise<void> {
    await requestOrThrow(
      `${API_BASE_URL}/api/admin/blogs/${encodeURIComponent(originalSlug)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      },
    );
  }

  async delete(slug: string): Promise<void> {
    await requestOrThrow(`${API_BASE_URL}/api/admin/blogs/${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });
  }
}

export const adminBlogRepository = new AdminBlogRepository();
