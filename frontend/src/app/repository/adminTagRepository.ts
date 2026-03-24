import { fetchJsonOrThrow, requestOrThrow, API_BASE_URL } from "@/app/network/adminApi";

export type Tag = {
  id: number;
  name: string;
  displayOrder: number;
};

class AdminTagRepository {
  async list(): Promise<Tag[]> {
    return await fetchJsonOrThrow<Tag[]>(`${API_BASE_URL}/api/tags`);
  }

  async create(name: string): Promise<Tag> {
    const res = await requestOrThrow(`${API_BASE_URL}/api/admin/tags`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    return (await res.json()) as Tag;
  }

  async update(id: number, name: string): Promise<Tag> {
    const res = await requestOrThrow(`${API_BASE_URL}/api/admin/tags/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    return (await res.json()) as Tag;
  }

  async delete(id: number): Promise<void> {
    await requestOrThrow(`${API_BASE_URL}/api/admin/tags/${id}`, { method: "DELETE" });
  }

  async reorder(orders: { id: number; displayOrder: number }[]): Promise<void> {
    await requestOrThrow(`${API_BASE_URL}/api/admin/tags/order`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orders }),
    });
  }
}

export const adminTagRepository = new AdminTagRepository();
