"use client";

import Link from "next/link";
import { useBlogListTop } from "@/app/hooks/top/useBlogListTop";
import { ROUTES } from "@/app/routes";

export default function BlogListSection() {
  const { blogs } = useBlogListTop(3);

  return (
    <div>
      <div className="flex justify-between items-baseline mb-6">
        <h3 className="text-3xl font-bold mb-6 text-gray-900">最新ブログ</h3>
        <div>
          <Link
            href={ROUTES.BLOG}
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            一覧はこちら
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.length === 0 ? (
          <div className="col-span-full text-center text-gray-600">
            記事がまだありません。
          </div>
        ) : (
          blogs.map((blog) => (
            <Link
              href={`${ROUTES.BLOG}/${blog.slug}`}
              key={blog.slug}
              className="block"
            >
              <div className="bg-gray-50 p-6 rounded-lg shadow-lg flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <h4 className="font-semibold mb-2 text-gray-900">
                  {blog.title}
                </h4>
                <p className="text-xs text-gray-600 mb-2">{blog.date}</p>
                <p className="text-sm mb-4 text-gray-700 flex-grow">
                  {blog.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-blue-600 text-sm font-medium">
                    続きを読む
                  </span>
                  <span className="text-blue-600 text-sm">→</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
