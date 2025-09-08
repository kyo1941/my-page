import { getAllPostSlugs, getPostData } from '../../data/blogData'; 
import Header from '../../header';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';

// ブログページの生成に必要なパスを事前に取得する関数
export async function generateStaticParams() {
  const paths = getAllPostSlugs();
  return paths.map(path => ({
      slug: path.params.slug,
  }));
}

// ページ本体のコンポーネント
export default async function PostPage({ params }: { params: { slug: string } }) {
  const postData = await getPostData(params.slug);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <article>
            {/* 記事タイトル */}
            <h1 className="text-4xl font-bold mb-4 text-gray-900">{postData.title}</h1>
            
            {/* 投稿日 */}
            <div className="text-gray-600 mb-8">{postData.date}</div>

            {/* 本文 (ReactMarkdownでレンダリング) */}
            <div className="max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeRaw]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 border-b border-gray-200 pb-2">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold mt-5 mb-3 text-gray-900">
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-lg font-semibold mt-4 mb-2 text-gray-900">
                      {children}
                    </h4>
                  ),
                  h5: ({ children }) => (
                    <h5 className="text-base font-semibold mt-3 mb-2 text-gray-900">
                      {children}
                    </h5>
                  ),
                  h6: ({ children }) => (
                    <h6 className="text-sm font-semibold mt-3 mb-2 text-gray-900">
                      {children}
                    </h6>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 text-gray-700 leading-relaxed">
                      {children}
                    </p>
                  ),
                  table: ({ children }) => (
                    <table className="min-w-full border-collapse border border-gray-300 my-4">
                      {children}
                    </table>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-gray-50">{children}</thead>
                  ),
                  tbody: ({ children }) => (
                    <tbody>{children}</tbody>
                  ),
                  tr: ({ children }) => (
                    <tr className="border-b border-gray-200">{children}</tr>
                  ),
                  th: ({ children }) => (
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">
                      {children}
                    </td>
                  ),
                }}
              >
                {postData.content}
              </ReactMarkdown>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}