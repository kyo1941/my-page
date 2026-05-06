"use client";

import { usePathname, useRouter, useParams } from "next/navigation";
import { UnauthorizedError } from "@/app/types/errors";
import { useAdminBlogEdit } from "@/app/hooks/admin/useAdminBlogEdit";
import { useAdminTags } from "@/app/hooks/admin/useAdminTags";
import { AdminDocForm } from "@/app/admin/components/AdminDocForm";
import { saveBlogRestore } from "@/app/utils/adminBlogRestore";

export default function EditBlogPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const originalSlug = params.slug as string;

  const handleUnauthorized = () => router.push("/admin/login");

  const {
    form: {
      title,
      setTitle,
      description,
      setDescription,
      content,
      setContent,
      tags,
      toggleTag,
      date,
      setDate,
      isDraft,
      setIsDraft,
    },
    state: { isLoading, restoreMessage },
    actions: { submitUpdate },
  } = useAdminBlogEdit(originalSlug, { onUnauthorized: handleUnauthorized });

  const {
    state: { tags: availableTags },
  } = useAdminTags({ onUnauthorized: handleUnauthorized });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await submitUpdate();
      router.push("/admin");
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        saveBlogRestore({
          kind: "blog:edit",
          slug: originalSlug,
          redirectPath: pathname,
          savedAt: Date.now(),
          payload: {
            title,
            description,
            content,
            tags,
            date,
            isDraft,
          },
        });
        router.push(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
      } else {
        alert("Failed to update blog");
      }
      console.error("Failed to update blog", error);
    }
  };

  return (
    <AdminDocForm
      heading="Edit Blog"
      title={title}
      setTitle={setTitle}
      date={date}
      setDate={setDate}
      description={description}
      setDescription={setDescription}
      content={content}
      setContent={setContent}
      isDraft={isDraft}
      setIsDraft={setIsDraft}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      publishLabel="ブログを更新する"
      restoreMessage={restoreMessage}
      extraFields={
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            タグ
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <label
                key={tag.id}
                className="flex items-center gap-1 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={tags.includes(tag.name)}
                  onChange={() => toggleTag(tag.name)}
                />
                <span>{tag.name}</span>
              </label>
            ))}
          </div>
        </div>
      }
    />
  );
}
