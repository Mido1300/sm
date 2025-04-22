import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Task, Priority } from '@/types/task';
import { useTodos } from './TodoContext';
import { Button } from '../ui/Button';

interface TaskFormProps {
  initialTask?: Partial<Task>;
  onClose: () => void;
}

const priorities: Priority[] = ['High', 'Medium', 'Low'];

function useToast() {
  const [toast, setToast] = React.useState<string | null>(null);
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }
  function Toast() {
    if (!toast) return null;
    return <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in">{toast}</div>;
  }
  return { showToast, Toast };
}

export default function TaskForm({ initialTask = {}, onClose }: TaskFormProps) {
  const { tasks, setTasks } = useTodos();
  const { showToast, Toast } = useToast();
  const [title, setTitle] = useState(initialTask.title || '');
  const [category, setCategory] = useState(initialTask.category || '');
  const [categories, setCategories] = useState<string[]>([]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setCategories(JSON.parse(localStorage.getItem('categories') || '[]'));
    }
  }, []);
  const [priority, setPriority] = useState<Priority>(initialTask.priority || 'Medium');
  const [dueDate, setDueDate] = useState(initialTask.dueDate || '');
  const [notes, setNotes] = useState(initialTask.notes || '');
  const [subtasks, setSubtasks] = useState(initialTask.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setError('');
    const now = new Date().toISOString();
    if (initialTask.id) {
      // Edit existing
      setTasks(tasks.map(t => t.id === initialTask.id ? {
        ...t,
        title, category, priority, dueDate, notes, subtasks, updatedAt: now,
      } : t));
    } else {
      // Add new
      setTasks([
        ...tasks,
        {
          id: Math.random().toString(36).slice(2),
          title,
          category,
          priority,
          dueDate,
          notes,
          subtasks,
          status: 'pending',
          timer: 0,
          createdAt: now,
          updatedAt: now,
        },
      ]);
    }
    showToast(initialTask.id ? 'Task updated!' : 'Task added!');
    setTimeout(onClose, 500);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      aria-modal="true"
      role="dialog"
    >
      <form
        className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6 flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <h3 className="text-lg font-semibold mb-2">{initialTask.id ? 'Edit Task' : 'Add Task'}</h3>
        <input
          className="input input-bordered w-full"
          placeholder="Title *"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        {categories.length > 0 ? (
          <select
            className="input input-bordered w-full"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        ) : (
          <input
            className="input input-bordered w-full"
            placeholder="Category"
            value={category}
            onChange={e => setCategory(e.target.value)}
          />
        )}
        <div className="flex gap-2 items-center">
          <label className="font-medium">Priority:</label>
          <select
            className="input input-bordered"
            value={priority}
            onChange={e => setPriority(e.target.value as Priority)}
          >
            {priorities.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <input
          className="input input-bordered w-full"
          type="date"
          value={dueDate ? dueDate.slice(0,10) : ''}
          onChange={e => setDueDate(e.target.value)}
        />
        {/* Subtasks UI */}
        <div>
          <label className="font-medium">Subtasks:</label>
          <div className="flex gap-2 mb-2">
            <input
              className="input input-bordered flex-1"
              placeholder="Add subtask"
              value={newSubtask}
              onChange={e => setNewSubtask(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && newSubtask.trim()) {
                  setSubtasks([...subtasks, { id: Math.random().toString(36).slice(2), title: newSubtask, completed: false }]);
                  setNewSubtask('');
                  e.preventDefault();
                }
              }}
            />
            <Button type="button" variant="secondary" onClick={() => {
              if (newSubtask.trim()) {
                setSubtasks([...subtasks, { id: Math.random().toString(36).slice(2), title: newSubtask, completed: false }]);
                setNewSubtask('');
              }
            }}>Add</Button>
          </div>
          <ul className="mb-2 space-y-1">
            {subtasks.map((st, idx) => (
              <li key={st.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={st.completed}
                  onChange={() => setSubtasks(subtasks.map((s, i) => i === idx ? { ...s, completed: !s.completed } : s))}
                  aria-label="Toggle subtask complete"
                />
                <input
                  className="input input-bordered flex-1 py-1 px-2 text-sm"
                  value={st.title}
                  onChange={e => setSubtasks(subtasks.map((s, i) => i === idx ? { ...s, title: e.target.value } : s))}
                />
                <Button type="button" variant="ghost" onClick={() => setSubtasks(subtasks.filter((_, i) => i !== idx))} aria-label="Delete subtask">🗑️</Button>
              </li>
            ))}
          </ul>
        </div>
        <textarea
          className="input input-bordered w-full min-h-[40px]"
          placeholder="Notes"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="flex gap-2 justify-end mt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">{initialTask.id ? 'Save' : 'Add'}</Button>
        </div>
      </form>
    <Toast />
    </motion.div>
  );
}
