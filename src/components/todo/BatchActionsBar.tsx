import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTodos } from './TodoContext';
import { Button } from '../ui/Button';

export default function BatchActionsBar() {
  const { tasks, setTasks, selectedIds, setSelectedIds } = useTodos();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  function handleBatchDelete() {
    setTasks(tasks.filter(t => !selectedIds.includes(t.id)));
    setSelectedIds([]);
    setShowConfirmDelete(false);
    showToastMessage(`${selectedIds.length} task${selectedIds.length > 1 ? 's' : ''} deleted`);
  }
  
  function handleBatchComplete() {
    setTasks(tasks.map(t => selectedIds.includes(t.id) ? { ...t, status: 'completed' } : t));
    setSelectedIds([]);
    showToastMessage(`${selectedIds.length} task${selectedIds.length > 1 ? 's' : ''} marked complete`);
  }
  
  function handleBatchPending() {
    setTasks(tasks.map(t => selectedIds.includes(t.id) ? { ...t, status: 'pending' } : t));
    setSelectedIds([]);
    showToastMessage(`${selectedIds.length} task${selectedIds.length > 1 ? 's' : ''} marked pending`);
  }
  
  function showToastMessage(message: string) {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3000);
  }
  
  // Export selected tasks to JSON
  function handleExportSelected() {
    const selectedTasks = tasks.filter(t => selectedIds.includes(t.id));
    const dataStr = JSON.stringify(selectedTasks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileName = `tasks_export_${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
    
    showToastMessage('Tasks exported successfully');
  }

  return (
    <>
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap gap-2 items-center bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/50 rounded-lg px-4 py-3 mb-4"
          >
            <span className="font-medium text-indigo-800 dark:text-indigo-200">
              <span className="inline-flex items-center justify-center bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-100 rounded-full w-6 h-6 mr-1.5">
                {selectedIds.length}
              </span>
              {selectedIds.length === 1 ? 'task' : 'tasks'} selected
            </span>
            
            <div className="flex-grow"></div>
            
            <div className="flex flex-wrap gap-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowConfirmDelete(true)}
                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center gap-1 text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleBatchComplete}
                className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-md flex items-center gap-1 text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Mark Complete
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleBatchPending}
                className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center gap-1 text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Mark Pending
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleExportSelected}
                className="px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-md flex items-center gap-1 text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Export Selected
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedIds([])}
                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md flex items-center gap-1 text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Clear Selection
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Confirm Delete Dialog */}
      <AnimatePresence>
        {showConfirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowConfirmDelete(false)}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h3 className="text-xl font-bold mb-2">Confirm Deletion</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to delete {selectedIds.length} {selectedIds.length === 1 ? 'task' : 'tasks'}? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button 
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
                  onClick={() => setShowConfirmDelete(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                  onClick={handleBatchDelete}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Toast Message */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50"
          >
            {showToast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
