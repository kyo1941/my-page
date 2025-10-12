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
  const res = await fetch(`${API_BASE_URL}/api/blogs`);
  try {
    if (!res.ok) {
      console.error('Failed to fetch blogs from API');
      return [];
    }
    const blogs = await res.json();
    return blogs;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
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
  try {
    const res = await fetch(`${API_BASE_URL}/api/blogs/${slug}`);
    if (!res.ok) {
      console.error(`Failed to fetch blog with slug: ${slug}`);
      return null;
    }
    const blog = await res.json();
    return blog;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}
