"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminBlogList } from "@/app/hooks/admin/useAdminBlogList";
import { useAdminPortfolioList } from "@/app/hooks/admin/useAdminPortfolioList";
import { UnauthorizedError } from "@/app/types/errors";
import type { AdminBlogListItem } from "@/app/types/blog";
import type { AdminPortfolioListItem } from "@/app/types/portfolio";

type Tab = "blog" | "portfolio";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("blog");

  const {
    state: { blogs, isLoading: blogLoading },
    actions: { deleteBlog },
  } = useAdminBlogList({
    onUnauthorized: () => router.push("/admin/login"),
  });

  const {
    state: { portfolios, isLoading: portfolioLoading },
    actions: { deletePortfolio },
  } = useAdminPortfolioList({
    onUnauthorized: () => router.push("/admin/login"),
  });

  const handleDeleteBlog = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      await deleteBlog(slug);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        router.push("/admin/login");
      } else {
        alert("Failed to delete blog");
      }
      console.error("Failed to delete blog", error);
    }
  };

  const handleDeletePortfolio = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this portfolio?")) return;

    try {
      await deletePortfolio(slug);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        router.push("/admin/login");
      } else {
        alert("Failed to delete portfolio");
      }
      console.error("Failed to delete portfolio", error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>

      <div className="mb-6 flex border-b">
        <button
          className={`px-6 py-2 font-semibold ${
            activeTab === "blog"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("blog")}
        >
          Blog
        </button>
        <button
          className={`px-6 py-2 font-semibold ${
            activeTab === "portfolio"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("portfolio")}
        >
          Portfolio
        </button>
      </div>

      {activeTab === "blog" && (
        <>
          <div className="mb-4 flex justify-end">
            <Link
              href="/admin/create"
              className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
            >
              ブログを投稿する
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full overflow-hidden rounded-lg bg-white shadow-md">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Tags</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(blogs as AdminBlogListItem[]).map((blog) => (
                  <tr key={blog.slug} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{blog.title}</td>
                    <td className="px-4 py-3">{blog.date}</td>
                    <td className="px-4 py-3">{blog.tags.join(", ")}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/edit/${blog.slug}`}
                        className="mr-2 text-blue-500 hover:text-blue-700"
                      >
                        編集
                      </Link>
                      <button
                        onClick={() => handleDeleteBlog(blog.slug)}
                        className="ml-2 text-red-500 hover:text-red-700"
                        disabled={blogLoading}
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
      )}

      {activeTab === "portfolio" && (
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
                {(portfolios as AdminPortfolioListItem[]).map((portfolio) => (
                  <tr
                    key={portfolio.slug}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">{portfolio.title}</td>
                    <td className="px-4 py-3">{portfolio.date}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/portfolio/edit/${portfolio.slug}`}
                        className="mr-2 text-blue-500 hover:text-blue-700"
                      >
                        編集
                      </Link>
                      <button
                        onClick={() => handleDeletePortfolio(portfolio.slug)}
                        className="ml-2 text-red-500 hover:text-red-700"
                        disabled={portfolioLoading}
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
      )}
    </div>
  );
}
