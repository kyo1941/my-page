export const revalidate = false;

import PageShell from "@/app/components/PageShell";
import BlogListSection from "./section/BlogListSection";
import TextSearchSection from "./section/TextSearchSection";
import TagSearchSection from "./section/TagSearchSection";
import { BlogSearchProvider } from "@/app/hooks/blog/useBlogSearchContext";
import { fetchBlogList, fetchTagList } from "@/app/lib/data/blog";

export default async function BlogPage() {
  const [initialBlogs, tags] = await Promise.all([
    fetchBlogList(),
    fetchTagList(),
  ]);
  const initialTags = tags.map((t) => t.name);

  return (
    <PageShell>
      <BlogSearchProvider initialTags={initialTags}>
        <div className="px-8 pt-8 sm:px-12 sm:pt-12">
          <h1 className="text-on-sky-subtle text-3xl font-bold mb-8 text-gray-900">
            ブログ
          </h1>
          <div className="space-y-12 sm:space-y-16">
            <div className="space-y-4">
              <TextSearchSection />
              <TagSearchSection />
            </div>

            <BlogListSection initialBlogs={initialBlogs} />
          </div>
        </div>
      </BlogSearchProvider>
    </PageShell>
  );
}
