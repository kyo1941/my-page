"use client";

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="text-base text-blue-600 hover:text-blue-700 hover:underline"
    >
      &lt; 戻る
    </button>
  );
}