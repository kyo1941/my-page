"use client";

import { useOgpData } from "@/app/hooks/admin/useOgpData";
import { MarkdownRenderer } from "@/app/components/MarkdownRenderer";

type AdminMarkdownPreviewProps = {
  content: string;
};

export function AdminMarkdownPreview({ content }: AdminMarkdownPreviewProps) {
  const hasContent = content.trim().length > 0;
  const ogpData = useOgpData(content);

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">プレビュー</h2>
      <aside className="self-start rounded border bg-white p-6 shadow lg:sticky lg:top-8">
        <div className="prose max-w-none">
          {hasContent ? (
            <MarkdownRenderer content={content} ogpData={ogpData} />
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
