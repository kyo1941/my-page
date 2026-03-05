"use client";

import { useRouter } from "next/navigation";

type BackButtonProps = {
  fallbackPath?: string;
};

export default function BackButton({ fallbackPath }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (fallbackPath && window.history.length <= 1) {
      router.push(fallbackPath);
    } else {
      router.back();
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="text-base text-blue-600 hover:text-blue-700 hover:underline"
    >
      &lt; 戻る
    </button>
  );
}
