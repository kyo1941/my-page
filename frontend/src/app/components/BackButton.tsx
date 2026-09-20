"use client";

import { useRouter } from "next/navigation";
import { FiChevronLeft } from "react-icons/fi";

type BackButtonProps = {
  fallbackPath: string;
};

export default function BackButton({ fallbackPath }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length <= 1) {
      router.push(fallbackPath);
    } else {
      router.back();
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex items-center text-base text-link-color hover:text-link-color-hover hover:underline"
    >
      <FiChevronLeft aria-hidden className="h-4 w-4" />
      戻る
    </button>
  );
}
