import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  show: boolean;
  onClose: () => void;
}

const toastColors = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-primary',
};

export function Toast({ message, type = 'info', show, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white z-50 ${toastColors[type]}`}
          role="alert"
          aria-live="assertive"
          onClick={onClose}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
