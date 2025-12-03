import "reflect-metadata";
import { injectable } from 'tsyringe';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type Blog = {
  slug: string; // ファイル名から自動で生成する
  title: string;
  date: string;
  description: string;
  coverImage?: string | undefined;
  tags?: string[];
  content: string;
};

export type BlogSearchParams = {
  limit?: number;
  tags?: string[];
  keyword?: string;
};

export interface IBlogRepository {
  getSortedPostsData(params?: BlogSearchParams): Promise<Blog[]>;
  getAllPostSlugs(): Promise<{ params: { slug: string } }[]>;
  getPostData(slug: string): Promise<Blog | null>;
}

@injectable()
export class BlogRepository implements IBlogRepository {
  async getSortedPostsData(params?: BlogSearchParams): Promise<Blog[]> {
  const searchParams = new URLSearchParams();
  
  if (params?.limit) {
    searchParams.append('limit', params.limit.toString());
  }
  if (params?.tags && params.tags.length > 0) {
    params.tags.forEach(tag => searchParams.append('tags', tag));
  }
  if (params?.keyword) {
    searchParams.append('keyword', params.keyword);
  }
  
    const queryString = searchParams.toString();
    const url = queryString 
      ? `${API_BASE_URL}/api/blogs?${queryString}` 
      : `${API_BASE_URL}/api/blogs`;
    const blogs = await fetchApi<Blog[]>(url);
    return blogs || [];
  }

  async getAllPostSlugs() {
    const blogs = await this.getSortedPostsData();

    return blogs.map((blog) => {
      return {
        params: {
          slug: blog.slug,
        },
      };
    });
  }

  async getPostData(slug: string): Promise<Blog | null> {
    return await fetchApi<Blog>(`${API_BASE_URL}/api/blogs/${slug}`);
  }
}

async function fetchApi<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Failed to fetch from API: ${res.status} for ${url}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    return null;
  }
}
