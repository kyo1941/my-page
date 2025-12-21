'use client';

import { useRouter, useParams } from 'next/navigation';
import { UnauthorizedError } from '@/app/types/errors';
import { useAdminBlogEdit } from '@/app/hooks/admin/useAdminBlogEdit';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const originalSlug = params.slug as string;

  const {
    form: {
      title,
      setTitle,
      slug,
      setSlug,
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
    actions: { submitUpdate },
  } = useAdminBlogEdit(originalSlug);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await submitUpdate();
      router.push('/admin');
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        router.push('/admin/login');
      } else {
        alert('Failed to update blog');
      }
      console.error('Failed to update blog', error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 text-3xl font-bold">Edit Blog</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">Title</label>
          <input
            className="w-full rounded border px-3 py-2 shadow focus:outline-none"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">Slug</label>
          <input
            className="w-full rounded border px-3 py-2 shadow focus:outline-none"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">Date</label>
          <input
            className="w-full rounded border px-3 py-2 shadow focus:outline-none"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">Description</label>
          <textarea
            className="w-full rounded border px-3 py-2 shadow focus:outline-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">Tags (comma separated)</label>
          <input
            className="w-full rounded border px-3 py-2 shadow focus:outline-none"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">Cover Image URL</label>
          <input
            className="w-full rounded border px-3 py-2 shadow focus:outline-none"
            type="text"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="mb-2 block text-sm font-bold text-gray-700">Content (Markdown)</label>
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
          Update Blog
        </button>
      </form>
    </div>
  );
}
