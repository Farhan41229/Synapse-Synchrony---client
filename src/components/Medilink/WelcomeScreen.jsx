import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SUGGESTED_QUESTIONS = [
  { text: 'How can I manage my anxiety better?' },
  { text: "I've been feeling overwhelmed lately" },
  { text: 'Can we talk about improving sleep?' },
  { text: 'I need help with work-life balance' },
];

const glowAnimation = {
  initial: { opacity: 0.5, scale: 1 },
  animate: {
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.05, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      easeInOut: 'easeInOut',
    },
  },
};

export default function WelcomeScreen({ onQuestionClick }) {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="relative inline-flex flex-col items-center">
            <motion.div
              className="absolute inset-0 bg-[#04642a]/20 blur-2xl rounded-full"
              initial="initial"
              animate="animate"
              variants={glowAnimation}
            />
            <div className="relative flex items-center gap-2 text-2xl font-semibold">
              <div className="relative">
                <Sparkles className="w-6 h-6 text-[#04642a]" />
                <motion.div
                  className="absolute inset-0 text-[#04642a]"
                  initial="initial"
                  animate="animate"
                  variants={glowAnimation}
                >
                  <Sparkles className="w-6 h-6" />
                </motion.div>
              </div>
              <span className="bg-gradient-to-r from-[#04642a] via-[#15a33d] to-[#04642a] bg-clip-text text-transparent">
                Medilink AI
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              How can I assist you today?
            </p>
          </div>
        </div>

        <div className="grid gap-3 relative">
          <motion.div
            className="absolute -inset-4 bg-gradient-to-b from-[#04642a]/5 to-transparent blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          />
          {SUGGESTED_QUESTIONS.map((q, index) => (
            <motion.div
              key={q.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
            >
              <Button
                variant="outline"
                className="w-full h-auto py-4 px-6 text-left justify-start hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-[#04642a]/50 transition-all duration-300"
                onClick={() => onQuestionClick(q.text)}
              >
                {q.text}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
