"use client";

import { useRouter, useParams } from "next/navigation";
import { UnauthorizedError } from "@/app/types/errors";
import { useAdminBlogEdit } from "@/app/hooks/admin/useAdminBlogEdit";
import { useAdminTags } from "@/app/hooks/admin/useAdminTags";
import { AdminMarkdownPreview } from "@/app/admin/components/AdminMarkdownPreview";
import { useCommittedPreview } from "@/app/hooks/admin/useCommittedPreview";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const originalSlug = params.slug as string;

  const handleUnauthorized = () => router.push("/admin/login");

  const {
    form: {
      title,
      setTitle,
      description,
      setDescription,
      content,
      setContent,
      tags,
      toggleTag,
      date,
      setDate,
    },
    state: { isLoading },
    actions: { submitUpdate },
  } = useAdminBlogEdit(originalSlug, { onUnauthorized: handleUnauthorized });

  const {
    state: { tags: availableTags },
  } = useAdminTags({ onUnauthorized: handleUnauthorized });

  const { previewContent, onCompositionStart, onCompositionEnd } =
    useCommittedPreview(content);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await submitUpdate();
      router.push("/admin");
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        router.push("/admin/login");
      } else {
        alert("Failed to update blog");
      }
      console.error("Failed to update blog", error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 text-3xl font-bold">Edit Blog</h1>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              タイトル
            </label>
            <input
              className="w-full rounded border px-3 py-2 shadow focus:outline-none"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              日付
            </label>
            <input
              className="w-full rounded border px-3 py-2 shadow focus:outline-none"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              説明文
            </label>
            <textarea
              className="w-full rounded border px-3 py-2 shadow focus:outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              タグ
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <label
                  key={tag.id}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={tags.includes(tag.name)}
                    onChange={() => toggleTag(tag.name)}
                  />
                  <span>{tag.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              本文
            </label>
            <textarea
              className="h-64 w-full rounded border px-3 py-2 shadow focus:outline-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onCompositionStart={onCompositionStart}
              onCompositionEnd={(e) => onCompositionEnd(e.currentTarget.value)}
              required
            />
          </div>
          <button
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
            type="submit"
            disabled={isLoading}
          >
            ブログを更新する
          </button>
        </form>
        <AdminMarkdownPreview content={previewContent} />
      </div>
    </div>
  );
}
