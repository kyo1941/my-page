"use client";

import { Reorder } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAdminTagOrder } from "@/app/hooks/admin/useAdminTagOrder";

export default function AdminTagOrderPage() {
  const router = useRouter();
  const {
    state: { orderedTags, isLoading, isSubmitting, isDirty, error },
    actions: { setOrderedTags, confirmOrder },
  } = useAdminTagOrder();

  const handleCancel = () => {
    if (isDirty && !confirm("変更が保存されていません。破棄しますか？")) return;
    router.push("/admin");
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  if (isLoading) return <p className="p-8">読み込み中...</p>;

  return (
    <div className="mx-auto max-w-lg p-8">
      <h1 className="mb-6 text-2xl font-bold">タグの表示順序を変更</h1>
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      <Reorder.Group
        axis="y"
        values={orderedTags}
        onReorder={setOrderedTags}
        className="mb-6 overflow-hidden rounded border bg-white shadow"
      >
        {orderedTags.map((tag, i) => (
          <Reorder.Item
            key={tag.id}
            value={tag}
            className="flex cursor-grab items-center gap-4 border-b px-4 py-3 last:border-b-0 active:cursor-grabbing"
          >
            <span className="w-6 text-right">{i + 1}</span>
            <span>{tag.name}</span>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <div className="flex gap-3">
        <button
          onClick={confirmOrder}
          disabled={isSubmitting || !isDirty}
          className="rounded bg-blue-500 px-6 py-2 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          確定
        </button>
        <button
          onClick={handleCancel}
          className="rounded border px-6 py-2 hover:bg-gray-100"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}
