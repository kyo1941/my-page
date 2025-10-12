import { useState, useEffect } from 'react';
import { getSortedPostsData, Blog } from '@/app/repository/blogRepository';

export function useBlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const allBlogs = await getSortedPostsData();
      setBlogs(allBlogs);
    };
    fetchBlogs();
  }, []);

  return { blogs };
}