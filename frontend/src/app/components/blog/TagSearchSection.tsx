"use client";

import { TAGS, Tag } from "../../data/tagData";
import { useState } from "react";

interface TagSearchSectionProps {
  onTagSelect?: (tags: Tag[]) => void;
}

export default function TagSearchSection({ onTagSelect = () => {} }: TagSearchSectionProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const handleTagClick = (tag: Tag) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newSelectedTags);
    onTagSelect(newSelectedTags);
  };

  return (
    <div>
        <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">タグで絞り込み</h2>
            <div className="flex flex-wrap gap-2">
                {TAGS.map((tag) => (
                    <button
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        className={`px-4 py-2 rounded-full border transition-colors duration-300 ${
                            selectedTags.includes(tag)
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-200 opacity-75'
                        }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
}