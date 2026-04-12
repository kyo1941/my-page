"use client";

import { useRef, useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";

type Props = {
  language?: string;
  children: React.ReactNode;
};

export function CodeBlock({ language, children }: Props) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = preRef.current?.textContent ?? "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-md overflow-hidden border border-gray-700">
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#161b22] border-b border-gray-700">
        <span className="text-xs text-gray-400 font-mono">
          {language ?? ""}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-100 transition-colors cursor-pointer select-none"
        >
          {copied ? (
            <>
              <FiCheck size={13} />
              Copied!
            </>
          ) : (
            <>
              <FiCopy size={13} />
              Copy
            </>
          )}
        </button>
      </div>
      <pre ref={preRef} className="!my-0 !rounded-none">
        {children}
      </pre>
    </div>
  );
}
