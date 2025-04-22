'use client';
import { motion } from 'framer-motion';
import { useDarkMode } from '@/hooks/useDarkMode';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

export default function DarkModeToggle() {
  const [isDark, toggleDark] = useDarkMode();
  return (
    <motion.button
      aria-label="Toggle dark mode"
      whileTap={{ scale: 0.9 }}
      className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-100 dark:bg-gray-800"
      onClick={toggleDark}
    >
      {isDark ? (
        <SunIcon className="w-6 h-6 text-yellow-400" />
      ) : (
        <MoonIcon className="w-6 h-6 text-gray-700" />
      )}
    </motion.button>
  );
}
