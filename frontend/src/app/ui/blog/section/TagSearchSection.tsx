"use client";

import { useBlogSearchContext } from "@/app/hooks/blog/useBlogSearchContext";

export default function TagSearchSection() {
  const { availableTags, selectedTags, toggleTag, setSelectedTags } =
    useBlogSearchContext();

  const handleClearTags = () => {
    setSelectedTags([]);
  };

  return (
    <div>
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-on-sky-subtle text-xl font-semibold text-gray-900">
            タグで絞り込み
          </h2>
          {selectedTags.length > 0 && (
            <button
              type="button"
              onClick={handleClearTags}
              className="text-on-sky-subtle text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              クリア
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-4 py-2 rounded-full border shadow-sm transition-colors duration-300 ${
                selectedTags.includes(tag)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
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
