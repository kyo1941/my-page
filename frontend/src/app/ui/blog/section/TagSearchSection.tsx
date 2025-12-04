"use client";

import { useBlogSearchContext } from '@/app/hooks/blog/useBlogSearchContext';
import { TAGS } from '@/app/data/tagData';

export default function TagSearchSection() {
  const { selectedTags, toggleTag, setSelectedTags } = useBlogSearchContext();

  const handleClearTags = () => {
    setSelectedTags([]);
  };

  return (
    <div>
        <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">タグで絞り込み</h2>
                {selectedTags.length > 0 && (
                    <button
                        type="button"
                        onClick={handleClearTags}
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        クリア
                    </button>
                )}
            </div>
            <div className="flex flex-wrap gap-2">
                {TAGS.map((tag) => (
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