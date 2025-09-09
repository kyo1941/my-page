import Header from "../header";
import BlogSection from "../components/blog/BlogSection";
import SearchSection from "../components/blog/SearchSection";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">

          <h1 className="text-4xl font-bold mb-8 text-gray-900">ブログ</h1>

          <section className="pb-6 mb-6">
            <SearchSection />
          </section>

          <section>
            <BlogSection />
          </section>
        </div>
      </main>
    </div>
  );
}
