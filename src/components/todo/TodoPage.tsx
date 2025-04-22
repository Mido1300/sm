import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';
import BatchActionsBar from './BatchActionsBar';
import ImportTasksButton from './ImportTasksButton';
import Insights from './Insights';
import { Button } from '../ui/Button';
import { useTodos } from './TodoContext';

type ViewMode = 'tasks' | 'insights';

export default function TodoPage() {
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('tasks');
  const { tasks } = useTodos();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">
            {viewMode === 'tasks' ? 'My Tasks' : 'Insights'}
          </h2>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'tasks' 
                ? 'bg-white dark:bg-gray-700 shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
              onClick={() => setViewMode('tasks')}
            >
              Tasks
            </button>
            <button
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'insights' 
                ? 'bg-white dark:bg-gray-700 shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
              onClick={() => setViewMode('insights')}
            >
              Insights
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          {viewMode === 'tasks' && (
            <>
              <ImportTasksButton />
              <Button 
                onClick={() => setShowForm(true)} 
                className="w-full sm:w-auto px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center gap-1 text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Task
              </Button>
            </>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'tasks' ? (
          <motion.div
            key="tasks-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <TaskFilters />
            <BatchActionsBar />
            <TaskList />
          </motion.div>
        ) : (
          <motion.div
            key="insights-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Insights />
          </motion.div>
        )}
      </AnimatePresence>
      
      {showForm && <TaskForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
