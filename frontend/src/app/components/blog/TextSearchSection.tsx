// TODO: 実際に検索する機能を実装する
export default function TextSearchSection() {
  return (
    <div>
        <div className="mt-6">
            <input
                type="text"
                placeholder="キーワードで検索"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    </div>
  );
}