import { useState, useEffect } from 'react';
import { Blog, getSortedPostsData } from '@/app/repository/blogRepository';

export function useBlogListTop(limit: number): { blogs: Blog[] } {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const topBlogs = await getSortedPostsData({ limit });
      setBlogs(topBlogs);
    };
    fetchData();
  }, [limit]);

  return { blogs };
}
