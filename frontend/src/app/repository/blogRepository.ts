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

export async function getSortedPostsData(): Promise<Blog[]> {
  const blogs = await fetchApi<Blog[]>(`${API_BASE_URL}/api/blogs`);
  return blogs || [];
}

export async function getAllPostSlugs() {
  const blogs = await getSortedPostsData();

  return blogs.map((blog) => {
    return {
      params: {
        slug: blog.slug,
      },
    };
  });
}

export async function getPostData(slug: string): Promise<Blog | null> {
  return await fetchApi<Blog>(`${API_BASE_URL}/api/blogs/${slug}`);
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
