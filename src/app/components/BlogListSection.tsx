import Link from "next/link";
import { getBlogs } from "../data/blogData";

export default function BlogListSection() {
  const blogs = getBlogs().slice(0, 3);

  return (
    <section className="border-b border-gray-200 py-12">
      <h3 className="text-2xl font-bold mb-6 text-gray-900">最新ブログ</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.length === 0 ? (
          <div className="col-span-full text-center text-gray-600">
            記事がまだありません。
          </div>
        ) : (
          blogs.map((blog) => (
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg flex flex-col h-full" key={blog.id}>
              <h4 className="font-semibold mb-2 text-gray-900">{blog.title}</h4>
              <p className="text-xs text-gray-600 mb-2">{blog.date}</p>
              <p className="text-sm mb-4 text-gray-700 flex-grow">{blog.description}</p>
              <Link href={blog.url} className="text-blue-600 text-sm no-underline hover:underline hover:text-blue-700 mt-auto">続きを読む</Link>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
