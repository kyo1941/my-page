import { useState, useEffect } from 'react';
import { container } from 'tsyringe';
import { Blog, IBlogRepository } from '@/app/repository/blogRepository';

export function useBlogListTop(limit: number): { blogs: Blog[] } {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const blogRepository = container.resolve<IBlogRepository>('IBlogRepository');

  useEffect(() => {
    const fetchData = async () => {
      const topBlogs = await blogRepository.getSortedPostsData({ limit });
      setBlogs(topBlogs);
    };
    fetchData();
  }, [limit]);

  return { blogs };
}
