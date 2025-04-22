import React from 'react';
import { motion } from 'framer-motion';
import { TaskStatus } from '@/types/task';

interface TaskStatusToggleProps {
  status: TaskStatus;
  onToggle: () => void;
}

export default function TaskStatusToggle({ status, onToggle }: TaskStatusToggleProps) {
  return (
    <button
      type="button"
      className={`w-6 h-6 rounded border flex items-center justify-center mr-2 ${status === 'completed' ? 'bg-green-200 border-green-500' : 'bg-white border-gray-300'}`}
      onClick={onToggle}
      aria-label={status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
      title={status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
    >
      {status === 'completed' ? '✔️' : ''}
    </button>
      {status === 'completed' ? (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-white text-lg"
        >
          ✓
        </motion.span>
      ) : (
        <span className="w-4 h-4 rounded-full border border-gray-400 dark:border-gray-600" />
      )}
    </motion.button>
  );
}
