import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTodos } from './TodoContext';
import { Button } from '../ui/Button';

export default function BatchActionsBar() {
  const { tasks, setTasks, selectedIds, setSelectedIds } = useTodos();

  function handleBatchDelete() {
    setTasks(tasks.filter(t => !selectedIds.includes(t.id)));
    setSelectedIds([]);
  }
  function handleBatchComplete() {
    setTasks(tasks.map(t => selectedIds.includes(t.id) ? { ...t, status: 'completed' } : t));
    setSelectedIds([]);
  }

  return (
    <AnimatePresence>
      {selectedIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex gap-2 items-center bg-primary/10 border border-primary rounded px-4 py-2 mb-2"
        >
          <span className="font-medium">{selectedIds.length} selected</span>
          <Button variant="danger" onClick={handleBatchDelete}>Delete</Button>
          <Button variant="primary" onClick={handleBatchComplete}>Mark Complete</Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
