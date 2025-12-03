"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Tag } from '@/app/data/tagData';

interface BlogSearchContextType {
  selectedTags: Tag[];
  keyword: string;
  setSelectedTags: (tags: Tag[]) => void;
  setKeyword: (keyword: string) => void;
  toggleTag: (tag: Tag) => void;
}

const BlogSearchContext = createContext<BlogSearchContextType | undefined>(undefined);

export function BlogSearchProvider({ children }: { children: ReactNode }) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [keyword, setKeyword] = useState<string>('');

  const toggleTag = useCallback((tag: Tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  }, []);

  return (
    <BlogSearchContext.Provider
      value={{
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
    throw new Error('useBlogSearchContext must be used within a BlogSearchProvider');
  }
  return context;
}
