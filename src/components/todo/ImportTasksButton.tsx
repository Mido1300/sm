"use client";
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTodos } from './TodoContext';
import { Task } from '@/types/task';

export default function ImportTasksButton() {
  const { tasks, setTasks } = useTodos();
  const [showModal, setShowModal] = useState(false);
  const [importResult, setImportResult] = useState<{ success: number; error: number } | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedTasks = JSON.parse(content);
        
        if (!Array.isArray(importedTasks)) {
          throw new Error('Invalid file format. Expected an array of tasks.');
        }

        // Validate tasks and assign new IDs to avoid duplicates
        let successCount = 0;
        let errorCount = 0;
        
        const validTasks = importedTasks.filter((task: any) => {
          if (!task.title || typeof task.title !== 'string') {
            errorCount++;
            return false;
          }
          
          // Assign a new ID to avoid collisions
          task.id = Math.random().toString(36).slice(2);
          
          // Ensure required fields have values
          task.status = task.status || 'pending';
          task.priority = task.priority || 'Medium';
          task.timer = task.timer || 0;
          
          // Ensure proper dates
          const now = new Date().toISOString();
          task.createdAt = task.createdAt || now;
          task.updatedAt = task.updatedAt || now;
          
          successCount++;
          return true;
        });
        
        // Add the valid tasks to existing tasks
        setTasks([...tasks, ...validTasks]);
        setImportResult({ success: successCount, error: errorCount });
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Show toast message
        if (successCount > 0) {
          showToastMessage(`Successfully imported ${successCount} tasks`);
        }
      } catch (error) {
        showToastMessage('Error importing tasks. Invalid file format.');
        setImportResult({ success: 0, error: 1 });
      }
    };
    
    reader.readAsText(file);
  };

  function showToastMessage(message: string) {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3000);
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setShowModal(true)}
        className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md flex items-center gap-1 text-sm font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        Import Tasks
      </motion.button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h3 className="text-xl font-bold mb-2">Import Tasks</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Import tasks from a JSON file. The file should contain an array of task objects.
              </p>
              
              <div className="mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/30 dark:file:text-indigo-300 dark:text-gray-300"
                />
              </div>
              
              {importResult && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <h4 className="font-semibold mb-1">Import Results</h4>
                  <p className="text-sm">
                    <span className="text-green-600 dark:text-green-400">{importResult.success} tasks imported successfully.</span>
                    {importResult.error > 0 && (
                      <span className="text-red-600 dark:text-red-400"> {importResult.error} tasks failed validation.</span>
                    )}
                  </p>
                </div>
              )}
              
              <div className="flex justify-end gap-3">
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </motion.button>
              </div>
              
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                <p className="font-semibold mb-1">Example format:</p>
                <pre className="bg-gray-50 dark:bg-gray-700 p-2 rounded overflow-auto text-xs">
                  {JSON.stringify([
                    {
                      "title": "Example Task",
                      "description": "This is an example task",
                      "priority": "Medium",
                      "category": "Work",
                      "status": "pending"
                    }
                  ], null, 2)}
                </pre>
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
