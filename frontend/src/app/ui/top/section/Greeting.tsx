"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Greeting() {
  const [displayText, setDisplayText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    /**
     * NOTE: 再レンダリング時に一文字目が重複されて表示されたため明示的にリセットする
     */
    setDisplayText("");

    const texts = ["Hello,", " I'm kyo1941."];
    const abortController = new AbortController();

    const typeText = async () => {
      const wait = (ms: number, signal: AbortSignal) =>
        new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(resolve, ms);
          signal.addEventListener("abort", () => {
            clearTimeout(timeout);
            reject(new DOMException("Aborted", "AbortError"));
          });
        });

      try {
        for (const segment of texts) {
          for (const char of segment) {
            setDisplayText((prev) => prev + char);
            await wait(120, abortController.signal);
          }
          await wait(65, abortController.signal);
        }
        setIsTypingComplete(true);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Typing animation error:", error);
      }
    };

    typeText();

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <div className="flex flex-col justify-center items-center text-center">
      <h1 className="text-on-sky text-4xl sm:text-6xl font-mono font-bold text-gray-900 tracking-tight">
        {displayText}
        <span className="inline-block w-[0.08em] h-[1em] bg-blue-600 ml-1 align-middle animate-blink" />
      </h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isTypingComplete ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-on-sky text-base sm:text-xl text-gray-700 mt-5 font-mono"
      >
        Android Engineer / Mapo tofu Developer
      </motion.p>
    </div>
  );
}
