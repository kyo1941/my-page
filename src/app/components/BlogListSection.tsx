import Link from "next/link";
import { getBlogs } from "../data/blogData";

export default function BlogListSection() {
  const blogs = getBlogs().slice(0, 3);

  return (
    <section className="border-b border-border pb-[5%] pt-[5%]">
      <h3 className="text-2xl font-bold mb-6">最新ブログ</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.length === 0 ? (
          <div className="col-span-full text-center text-gray">
            記事がまだありません。
          </div>
        ) : (
          blogs.map((blog) => (
            <div className="bg-light-gray p-6 rounded-lg shadow-sm" key={blog.id}>
              <h4 className="font-semibold mb-2">{blog.title}</h4>
              <p className="text-xs text-gray mb-2">{blog.date}</p>
              <p className="text-sm mb-4">{blog.description}</p>
              <Link href={blog.url} className="text-link-color text-sm no-underline hover:underline">続きを読む</Link>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
