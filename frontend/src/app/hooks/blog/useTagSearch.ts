import { useState } from 'react';
import { TAGS, Tag } from '@/app/data/tagData';

export function useTagSearch() {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const toggleTag = (tag: Tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  // TODO: selectedTagsをもとに絞り込みロジックを今後実装する

  return {
    tags: TAGS,
    selectedTags,
    toggleTag,
  };
}
