import Link from "next/link";
import { getSortedPostsData } from "../../../data/blogData";
import { ROUTES } from "@/app/routes";

export default function BlogListSection() {
  const blogs = getSortedPostsData();

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-12">
        {blogs.length === 0 ? (
          <div className="col-span-full text-center text-gray-600">
            記事がまだありません。
          </div>
        ) : (
          blogs.map((blog) => (
            <Link href={`${ROUTES.BLOG}/${blog.slug}`} key={blog.slug} className="block">
              <div className="bg-gray-50 p-7 rounded-lg shadow-lg flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <h4 className="font-semibold mb-2 text-gray-900">{blog.title}</h4>
                <p className="text-xs text-gray-600 mb-2">{blog.date}</p>
                <p className="text-sm mb-4 text-gray-700 flex-grow">{blog.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-blue-600 text-sm font-medium">続きを読む</span>
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
