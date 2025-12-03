import { useState, useEffect } from 'react';
import { container } from 'tsyringe';
import { IBlogRepository, Blog } from '@/app/repository/blogRepository';
import { useBlogSearchContext } from './useBlogSearchContext';

export function useBlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedTags, keyword } = useBlogSearchContext();
  const blogRepository = container.resolve<IBlogRepository>('IBlogRepository');

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      const allBlogs = await blogRepository.getSortedPostsData({
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        keyword: keyword || undefined,
      });
      setBlogs(allBlogs);
      setIsLoading(false);
    };
    fetchBlogs();
  }, [selectedTags, keyword]);

  return { blogs, isLoading };
}