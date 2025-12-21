'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditBlogPage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [date, setDate] = useState('');
  const router = useRouter();
  const params = useParams();
  const originalSlug = params.slug as string;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${originalSlug}`);
        if (res.ok) {
          const data = await res.json();
          setTitle(data.title);
          setSlug(data.slug);
          setDescription(data.description);
          setContent(data.content);
          setTags(data.tags.join(', '));
          setCoverImage(data.coverImage || '');

          // Convert date format "yyyy年M月d日" to "yyyy-MM-dd" for input type="date"
          const dateMatch = data.date.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
          if (dateMatch) {
            const year = dateMatch[1];
            const month = dateMatch[2].padStart(2, '0');
            const day = dateMatch[3].padStart(2, '0');
            setDate(`${year}-${month}-${day}`);
          }
        }
      } catch (error) {
        console.error('Failed to fetch blog', error);
      }
    };

    if (originalSlug) {
      fetchBlog();
    }
  }, [originalSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const blogData = {
      title,
      slug,
      description,
      content,
      tags: tags.split(',').map((tag) => tag.trim()),
      coverImage,
      date: new Date(date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }),
    };

    try {
      const res = await fetch(`/api/blogs/edit/${originalSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });

      if (res.ok) {
        router.push('/admin');
      } else if (res.status === 401) {
        router.push('/admin/login');
      } else {
        alert('Failed to update blog');
      }
    } catch (error) {
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
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          type="submit"
        >
          Update Blog
        </button>
      </form>
    </div>
  );
}
