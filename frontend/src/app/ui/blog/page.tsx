import Header from "@/app/components/header";
import BlogListSection from "./section/BlogListSection";
import TextSearchSection from "./section/TextSearchSection";
import TagSearchSection from "./section/TagSearchSection";
import { BlogSearchProvider } from "@/app/hooks/blog/useBlogSearchContext";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold mb-8 text-gray-900">ブログ</h1>

          <BlogSearchProvider>
            <section className="pb-2 mb-2">
              <TextSearchSection />
            </section>

            <section className="border-b border-gray-200 pb-8 mb-8">
              <TagSearchSection />
            </section>

            <section>
              <BlogListSection />
            </section>
          </BlogSearchProvider>
        </div>
      </main>
    </div>
  );
}
