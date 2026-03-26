import { useState, useEffect, useRef } from "react";
import { Blog, blogRepository } from "@/app/repository/blogRepository";
import { useBlogSearchContext } from "./useBlogSearchContext";

export function useBlogList(initialBlogs: Blog[]) {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedTags, keyword } = useBlogSearchContext();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
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
