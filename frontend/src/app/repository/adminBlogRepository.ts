import type {
  AdminBlogListItem,
  Blog,
  BlogUpsertInput,
} from "@/app/types/blog";
import { requestOrThrow, fetchJsonOrThrow } from "@/app/network/adminApi";

class AdminBlogRepository {
  async list(): Promise<AdminBlogListItem[]> {
    return await fetchJsonOrThrow<AdminBlogListItem[]>("/api/blogs");
  }

  async get(slug: string): Promise<Blog> {
    return await fetchJsonOrThrow<Blog>(
      `/api/blogs/${encodeURIComponent(slug)}`,
    );
  }

  async create(input: BlogUpsertInput): Promise<void> {
    await requestOrThrow("/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  }

  async update(originalSlug: string, input: BlogUpsertInput): Promise<void> {
    await requestOrThrow(`/api/blogs/${encodeURIComponent(originalSlug)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  }

  async delete(slug: string): Promise<void> {
    await requestOrThrow(`/api/blogs/${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });
  }
}

export const adminBlogRepository = new AdminBlogRepository();
