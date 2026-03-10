"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminBlogList } from "@/app/hooks/admin/useAdminBlogList";
import { useAdminPortfolioList } from "@/app/hooks/admin/useAdminPortfolioList";
import { UnauthorizedError } from "@/app/types/errors";
import AdminBlogTab from "@/app/admin/AdminBlogTab";
import AdminPortfolioTab from "@/app/admin/AdminPortfolioTab";

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
        <AdminBlogTab
          blogs={blogs}
          isLoading={blogLoading}
          onDelete={handleDeleteBlog}
        />
      )}

      {activeTab === "portfolio" && (
        <AdminPortfolioTab
          portfolios={portfolios}
          isLoading={portfolioLoading}
          onDelete={handleDeletePortfolio}
        />
      )}
    </div>
  );
}
