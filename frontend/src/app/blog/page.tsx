import Header from "../header";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">

          <h1 className="text-4xl font-bold mb-8 text-gray-900">ブログ</h1>

          <div className="text-center text-gray-600 py-12">
            <p>ブログ記事を準備中です。</p>
          </div>
        </div>
      </main>
    </div>
  );
}
