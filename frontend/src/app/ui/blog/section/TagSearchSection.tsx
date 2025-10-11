"use client";

import { useTagSearch } from '@/app/hooks/blog/useTagSearch';

export default function TagSearchSection() {
  const { tags, selectedTags, toggleTag } = useTagSearch();

  return (
    <div>
        <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">タグで絞り込み</h2>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
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