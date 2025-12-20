"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function WelcomeSection() {
  const text = "Hello, I'm kyo1941.";
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        const char = text.charAt(index);
        setDisplayText((prev) => prev + char);
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
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
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 0.8 }}
        className="text-sm sm:text-lg text-gray-500 mt-4 font-mono"
      >
        Android Engineer / Mapo tofu Developer
      </motion.p>
    </div>
  );
}
