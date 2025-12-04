"use client";

import { useState, useEffect } from 'react';
import { useBlogSearchContext } from '@/app/hooks/blog/useBlogSearchContext';

export default function TextSearchSection() {
  const { setKeyword } = useBlogSearchContext();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, setKeyword]);

  const handleClear = () => {
    setInputValue('');
    setKeyword('');
  };

  return (
    <div>
        <div className="mt-6 relative">
            <input
                type="text"
                placeholder="キーワードで検索"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            {inputValue && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="キーワードをクリア"
                >
                    ✕
                </button>
            )}
        </div>
    </div>
  );
}