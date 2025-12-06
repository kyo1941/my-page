import { useState, useEffect } from "react";
import { Blog, blogRepository } from "@/app/repository/blogRepository";
import { useBlogSearchContext } from "./useBlogSearchContext";

export function useBlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedTags, keyword } = useBlogSearchContext();

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
