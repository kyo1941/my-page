"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function WelcomeSection() {
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
        throw error;
      }
    };

    typeText();

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <div className="h-32 flex flex-col justify-center items-center">
      <h2 className="text-3xl sm:text-5xl font-mono font-bold text-gray-900">
        {displayText}
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-[0.1em] h-[1em] bg-blue-600 ml-1 align-middle"
        />
      </h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isTypingComplete ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-sm sm:text-lg text-gray-500 mt-4 font-mono"
      >
        Android Engineer / Mapo tofu Developer
      </motion.p>
    </div>
  );
}
