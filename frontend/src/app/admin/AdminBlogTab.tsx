import Link from "next/link";
import type { AdminBlogListItem } from "@/app/types/blog";

type Props = {
  blogs: AdminBlogListItem[];
  isLoading: boolean;
  onDelete: (slug: string) => void;
};

export default function AdminBlogTab({ blogs, isLoading, onDelete }: Props) {
  return (
    <>
      <div className="mb-4 flex justify-end">
        <Link
          href="/admin/blog/create"
          className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
        >
          ブログを投稿する
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
            {blogs.map((blog) => (
              <tr key={blog.slug} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  {blog.title}
                  {blog.isDraft && (
                    <span className="ml-2 inline-flex items-center rounded bg-gray-200 px-1.5 py-0.5 text-xs text-gray-600">
                      ✏️ 下書き
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">{blog.date}</td>
                <td className="px-4 py-3">{blog.tags.join(", ")}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/blog/edit/${blog.slug}`}
                    className="mr-2 text-blue-500 hover:text-blue-700"
                  >
                    編集
                  </Link>
                  <button
                    onClick={() => onDelete(blog.slug)}
                    className="ml-2 text-red-500 hover:text-red-700"
                    disabled={isLoading}
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
