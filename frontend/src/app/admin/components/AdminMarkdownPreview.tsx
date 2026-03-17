"use client";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

type AdminMarkdownPreviewProps = {
  content: string;
};

export function AdminMarkdownPreview({ content }: AdminMarkdownPreviewProps) {
  const hasContent = content.trim().length > 0;

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">プレビュー</h2>
      <aside className="self-start rounded border bg-white p-6 shadow lg:sticky lg:top-8">
        <div className="prose max-w-none">
          {hasContent ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
            >
              {content}
            </ReactMarkdown>
          ) : (
            <p className="text-sm text-gray-500">
              本文を入力するとここにプレビューが表示されます。
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
