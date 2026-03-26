"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface BlogSearchContextType {
  availableTags: string[];
  selectedTags: string[];
  keyword: string;
  setSelectedTags: (tags: string[]) => void;
  setKeyword: (keyword: string) => void;
  toggleTag: (tag: string) => void;
}

const BlogSearchContext = createContext<BlogSearchContextType | undefined>(
  undefined,
);

export function BlogSearchProvider({
  children,
  initialTags,
}: {
  children: ReactNode;
  initialTags: string[];
}) {
  const [availableTags] = useState<string[]>(initialTags);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [keyword, setKeyword] = useState<string>("");

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }, []);

  return (
    <BlogSearchContext.Provider
      value={{
        availableTags,
        selectedTags,
        keyword,
        setSelectedTags,
        setKeyword,
        toggleTag,
      }}
    >
      {children}
    </BlogSearchContext.Provider>
  );
}

export function useBlogSearchContext() {
  const context = useContext(BlogSearchContext);
  if (!context) {
    throw new Error(
      "useBlogSearchContext must be used within a BlogSearchProvider",
    );
  }
  return context;
}
