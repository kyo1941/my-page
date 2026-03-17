import { API_BASE_URL, fetchJsonOrNull } from "@/app/network/publicApi";

export type Tag = {
  id: number;
  name: string;
};

class TagRepository {
  async getAll(): Promise<Tag[]> {
    const tags = await fetchJsonOrNull<Tag[]>(`${API_BASE_URL}/api/tags`);
    return tags || [];
  }
}

export const tagRepository = new TagRepository();
