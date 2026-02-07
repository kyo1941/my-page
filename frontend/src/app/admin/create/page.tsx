"use client";

import { useRouter } from "next/navigation";
import { UnauthorizedError } from "@/app/types/errors";
import { useAdminBlogCreate } from "@/app/hooks/admin/useAdminBlogCreate";

export default function CreateBlogPage() {
  const router = useRouter();

  const {
    form: {
      title,
      setTitle,
      description,
      setDescription,
      content,
      setContent,
      tags,
      setTags,
      coverImage,
      setCoverImage,
      date,
      setDate,
    },
    state: { isLoading },
    actions: { submitCreate },
  } = useAdminBlogCreate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await submitCreate();
      router.push("/admin");
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        router.push("/admin/login");
      } else {
        alert("Failed to create blog");
      }
      console.error("Failed to create blog", error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 text-3xl font-bold">新規作成</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl">
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
          <input
            className="w-full rounded border px-3 py-2 shadow focus:outline-none"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            画像URL
          </label>
          <input
            className="w-full rounded border px-3 py-2 shadow focus:outline-none"
            type="text"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            内容
          </label>
          <textarea
            className="h-64 w-full rounded border px-3 py-2 shadow focus:outline-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
          type="submit"
          disabled={isLoading}
        >
          ブログを投稿する
        </button>
      </form>
    </div>
  );
}
