import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/types/task';

interface TaskShareProps {
  task: Task;
  onClose: () => void;
}

export default function TaskShare({ task, onClose }: TaskShareProps) {
  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'social' | 'text'>('link');
  
  const taskText = `Task: ${task.title}\n${task.description ? `Description: ${task.description}\n` : ''}${task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleString()}\n` : ''}Priority: ${task.priority}\nStatus: ${task.status}${task.subtasks && task.subtasks.length > 0 ? `\nSubtasks:\n${task.subtasks.map(st => `- [${st.completed ? 'x' : ' '}] ${st.title}`).join('\n')}` : ''}`;
  
  const shareUrl = `${window.location.origin}/share?id=${task.id}`;
  
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };
  
  const socialLinks = [
    {
      name: 'Twitter',
      icon: <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"></path></svg>,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out my task: ${task.title}`)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Facebook',
      icon: <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.615v-6.96h-2.338v-2.725h2.338v-2c0-2.325 1.42-3.592 3.5-3.592.699-.002 1.399.034 2.095.107v2.42h-1.435c-1.128 0-1.348.538-1.348 1.325v1.735h2.697l-.35 2.725h-2.348V21H20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z"></path></svg>,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Email',
      icon: <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path></svg>,
      url: `mailto:?subject=${encodeURIComponent(`Task: ${task.title}`)}&body=${encodeURIComponent(taskText)}`
    }
  ];

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold">Share Task</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex border-b dark:border-gray-700 mb-4">
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'link' ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab('link')}
            >
              Copy Link
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'social' ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab('social')}
            >
              Social
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'text' ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab('text')}
            >
              Text
            </button>
          </div>
          
          {activeTab === 'link' && (
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={shareUrl} 
                readOnly 
                className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-1"
                onClick={() => handleCopyToClipboard(shareUrl)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                Copy
              </motion.button>
            </div>
          )}
          
          {activeTab === 'social' && (
            <div className="grid grid-cols-3 gap-4">
              {socialLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.url}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="text-gray-700 dark:text-gray-300">{link.icon}</div>
                  <span className="text-sm font-medium">{link.name}</span>
                </a>
              ))}
            </div>
          )}
          
          {activeTab === 'text' && (
            <div className="flex flex-col gap-3">
              <textarea 
                className="w-full h-32 p-3 border rounded-lg font-mono text-sm dark:bg-gray-700 dark:border-gray-600"
                value={taskText}
                readOnly
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-1 justify-center"
                onClick={() => handleCopyToClipboard(taskText)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                Copy Text
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
      
      <AnimatePresence>
        {showToast && (
          <motion.div
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            Copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Simple button to trigger the share modal
export function ShareButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type="button"
      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      onClick={onClick}
      aria-label="Share Task"
      title="Share Task"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
      Share
    </motion.button>
  );
}
