'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminBlogList } from '@/app/hooks/admin/useAdminBlogList';
import { UnauthorizedError } from '@/app/types/errors';
import type { AdminBlogListItem } from '@/app/types/blog';

export default function AdminDashboard() {
  const router = useRouter();

  const {
    state: { blogs, isLoading },
    actions: { deleteBlog },
  } = useAdminBlogList();

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      await deleteBlog(slug);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        router.push('/admin/login');
      } else {
        alert('Failed to delete blog');
      }
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
        <table className="min-w-full overflow-hidden rounded-lg bg-white shadow-md">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Tags</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(blogs as AdminBlogListItem[]).map((blog) => (
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
                    disabled={isLoading}
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
