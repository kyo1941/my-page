'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Blog {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
}

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs');
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (error) {
      console.error('Failed to fetch blogs', error);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      const res = await fetch(`/api/blogs/delete/${slug}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchBlogs();
      } else if (res.status === 401) {
        router.push('/admin/login');
      } else {
        alert('Failed to delete blog');
      }
    } catch (error) {
      console.error('Failed to delete blog', error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link
          href="/admin/create"
          className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
        >
          Create New Blog
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Tags</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.slug} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{blog.title}</td>
                <td className="px-4 py-3">{blog.date}</td>
                <td className="px-4 py-3">{blog.tags.join(', ')}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/edit/${blog.slug}`}
                    className="mr-2 text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(blog.slug)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

