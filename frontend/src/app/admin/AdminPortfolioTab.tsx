import Link from "next/link";
import type { AdminPortfolioListItem } from "@/app/types/portfolio";

type Props = {
  portfolios: AdminPortfolioListItem[];
  isLoading: boolean;
  onDelete: (slug: string) => void;
};

export default function AdminPortfolioTab({
  portfolios,
  isLoading,
  onDelete,
}: Props) {
  return (
    <>
      <div className="mb-4 flex justify-end">
        <Link
          href="/admin/portfolio/create"
          className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
        >
          ポートフォリオを投稿する
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full overflow-hidden rounded-lg bg-white shadow-md">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {portfolios.map((portfolio) => (
              <tr key={portfolio.slug} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  {portfolio.title}
                  {portfolio.isDraft && (
                    <span className="ml-2 inline-flex items-center rounded bg-gray-200 px-1.5 py-0.5 text-xs text-gray-600">
                      ✏️ 下書き
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">{portfolio.date}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/portfolio/edit/${portfolio.slug}`}
                    className="mr-2 text-blue-500 hover:text-blue-700"
                  >
                    編集
                  </Link>
                  <button
                    onClick={() => onDelete(portfolio.slug)}
                    className="ml-2 text-red-500 hover:text-red-700"
                    disabled={isLoading}
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
