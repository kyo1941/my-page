"use client";

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useSkillsSection } from '@/app/hooks/profile/useSkillsSection';

export default function SkillsSection() {
  const { skills, selectedSkill, setSelectedSkill } = useSkillsSection();

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 text-gray-900">技術スタック</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        
        {skills.map((skill) => (
          <button
            key={skill.name}
            className="flex flex-col items-center py-2 bg-gray-50 rounded-lg shadow hover:-translate-y-0.5 hover:shadow-xl hover:bg-gray-100 transition-all duration-300"
            onClick={() => setSelectedSkill(selectedSkill === skill.name ? null : skill.name)}
          >
            <Image
              src={skill.icon}
              alt={`${skill.name} icon`}
              width={48}
              height={48}
              className="mb-2"
            />
            <span className="text-sm font-medium text-gray-700">{skill.name}</span>
          </button>
        ))}
      </div>
      
      
      <AnimatePresence>
        {selectedSkill && (() => {
          const skill = skills.find(s => s.name === selectedSkill);
          if (!skill) return null;

          return (
            <motion.div 
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedSkill(null)}
              
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
                onClick={(e) => e.stopPropagation()}
                
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
                  onClick={() => setSelectedSkill(null)}
                  aria-label="閉じる"
                >
                  ×
                </button>
                <div className="flex items-center mb-4">
                  <Image
                    src={skill.icon}
                    alt={`${skill.name} icon`}
                    width={64}
                    height={64}
                    className="mr-4"
                  />
                  <h3 className="text-2xl font-bold text-gray-900">{skill.name}</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {skill.description}
                </p>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
