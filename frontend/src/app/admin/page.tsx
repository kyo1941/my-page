"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminBlogList } from "@/app/hooks/admin/useAdminBlogList";
import { useAdminPortfolioList } from "@/app/hooks/admin/useAdminPortfolioList";
import { useAdminTags } from "@/app/hooks/admin/useAdminTags";
import { UnauthorizedError } from "@/app/types/errors";
import AdminBlogTab from "@/app/admin/AdminBlogTab";
import AdminPortfolioTab from "@/app/admin/AdminPortfolioTab";
import AdminTagTab from "@/app/admin/AdminTagTab";

type Tab = "blog" | "portfolio" | "tag";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("blog");

  const handleUnauthorized = () => router.push("/admin/login");

  const {
    state: { blogs, isLoading: blogLoading },
    actions: { deleteBlog },
  } = useAdminBlogList({ onUnauthorized: handleUnauthorized });

  const {
    state: { portfolios, isLoading: portfolioLoading },
    actions: { deletePortfolio },
  } = useAdminPortfolioList({ onUnauthorized: handleUnauthorized });

  const {
    state: { tags, isLoading: tagLoading },
    actions: { createTag, updateTag, deleteTag },
  } = useAdminTags({ onUnauthorized: handleUnauthorized });

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

  const handleCreateTag = async (name: string) => {
    try {
      await createTag(name);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        router.push("/admin/login");
      } else {
        alert("Failed to create tag");
      }
      console.error("Failed to create tag", error);
    }
  };

  const handleUpdateTag = async (id: number, name: string) => {
    try {
      await updateTag(id, name);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        router.push("/admin/login");
      } else {
        alert("Failed to update tag");
      }
      console.error("Failed to update tag", error);
    }
  };

  const handleDeleteTag = async (id: number) => {
    if (!confirm("このタグを削除しますか？")) return;

    try {
      await deleteTag(id);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        router.push("/admin/login");
      } else {
        alert("Failed to delete tag");
      }
      console.error("Failed to delete tag", error);
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
        <button
          className={`px-6 py-2 font-semibold ${
            activeTab === "tag"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("tag")}
        >
          Tag
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

      {activeTab === "tag" && (
        <AdminTagTab
          tags={tags}
          isLoading={tagLoading}
          onCreate={handleCreateTag}
          onUpdate={handleUpdateTag}
          onDelete={handleDeleteTag}
        />
      )}
    </div>
  );
}
