"use client";

import { useState } from "react";
import type { Tag } from "@/app/repository/adminTagRepository";

type Props = {
  tags: Tag[];
  isLoading: boolean;
  onCreate: (name: string) => Promise<void>;
  onUpdate: (id: number, name: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export default function AdminTagTab({
  tags,
  isLoading,
  onCreate,
  onUpdate,
  onDelete,
}: Props) {
  const [newTagName, setNewTagName] = useState("");
  const [createError, setCreateError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editError, setEditError] = useState("");

  const isDuplicate = (name: string, excludeId?: number) =>
    tags.some(
      (t) =>
        t.name === name.trim() &&
        (excludeId === undefined || t.id !== excludeId),
    );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    const trimmed = newTagName.trim();
    if (!trimmed) return;
    if (isDuplicate(trimmed)) {
      setCreateError(`「${trimmed}」はすでに存在します。`);
      return;
    }
    await onCreate(trimmed);
    setNewTagName("");
  };

  const handleEditStart = (tag: Tag) => {
    setEditingId(tag.id);
    setEditingName(tag.name);
    setEditError("");
  };

  const handleEditSave = async (id: number) => {
    setEditError("");
    const trimmed = editingName.trim();
    if (!trimmed) return;
    if (isDuplicate(trimmed, id)) {
      setEditError(`「${trimmed}」はすでに存在します。`);
      return;
    }
    await onUpdate(id, trimmed);
    setEditingId(null);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName("");
    setEditError("");
  };

  return (
    <>
      <div className="mb-6">
        <form onSubmit={handleCreate} className="flex flex-col gap-1 max-w-sm">
          <div className="flex gap-2">
            <input
              className="flex-1 rounded border px-3 py-2 shadow focus:outline-none"
              type="text"
              value={newTagName}
              onChange={(e) => {
                setNewTagName(e.target.value);
                setCreateError("");
              }}
              placeholder="新しいタグ名"
            />
            <button
              type="submit"
              disabled={isLoading || !newTagName.trim()}
              className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700 disabled:opacity-50"
            >
              追加
            </button>
          </div>
          {createError && <p className="text-sm text-red-500">{createError}</p>}
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full overflow-hidden rounded-lg bg-white shadow-md">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">タグ名</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <tr key={tag.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  {editingId === tag.id ? (
                    <div className="flex flex-col gap-1">
                      <input
                        className="rounded border px-2 py-1 focus:outline-none"
                        value={editingName}
                        onChange={(e) => {
                          setEditingName(e.target.value);
                          setEditError("");
                        }}
                      />
                      {editError && (
                        <p className="text-sm text-red-500">{editError}</p>
                      )}
                    </div>
                  ) : (
                    tag.name
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingId === tag.id ? (
                    <>
                      <button
                        onClick={() => handleEditSave(tag.id)}
                        className="mr-2 text-blue-500 hover:text-blue-700"
                        disabled={isLoading}
                      >
                        保存
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        キャンセル
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditStart(tag)}
                        className="mr-2 text-blue-500 hover:text-blue-700"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => onDelete(tag.id)}
                        className="ml-2 text-red-500 hover:text-red-700"
                        disabled={isLoading}
                      >
                        削除
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
