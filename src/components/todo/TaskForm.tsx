"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Task, Priority } from '@/types/task';
import { useTodos } from './TodoContext';
import { Button } from '../ui/Button';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';

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
  const [description, setDescription] = useState(initialTask.description || '');
  const [category, setCategory] = useState(initialTask.category || '');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCategories(JSON.parse(localStorage.getItem('categories') || '[]'));
    }
  }, []);
  
  const [priority, setPriority] = useState<Priority>(initialTask.priority || 'Medium');
  const [dueDate, setDueDate] = useState<Date | null>(initialTask.dueDate ? new Date(initialTask.dueDate) : null);
  const [notes, setNotes] = useState(initialTask.notes || '');
  const [subtasks, setSubtasks] = useState(initialTask.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Validate form
    const newErrors: {[key: string]: string} = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    const now = new Date().toISOString();
    const dueDateString = dueDate ? dueDate.toISOString() : '';
    
    if (initialTask.id) {
      // Edit existing
      setTasks(tasks.map(t => t.id === initialTask.id ? {
        ...t,
        title, 
        description,
        category, 
        priority, 
        dueDate: dueDateString, 
        notes, 
        subtasks, 
        updatedAt: now,
      } : t));
    } else {
      // Add new
      setTasks([
        ...tasks,
        {
          id: Math.random().toString(36).slice(2),
          title,
          description,
          category,
          priority,
          dueDate: dueDateString,
          notes,
          subtasks,
          status: 'pending',
          timer: 0,
          createdAt: now,
          updatedAt: now,
        },
      ]);
    }
    
    // Save category if it's new
    if (category && !categories.includes(category)) {
      const updatedCategories = [...categories, category];
      setCategories(updatedCategories);
      localStorage.setItem('categories', JSON.stringify(updatedCategories));
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
        <div className="space-y-1">
          <input
            className={`input input-bordered w-full ${errors.title ? 'border-red-500' : ''}`}
            placeholder="Title *"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
        </div>
        
        <textarea
          className="input input-bordered w-full min-h-[60px]"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
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
        <div className="w-full">
          <label className="font-medium mb-1 block">Due Date:</label>
          <Flatpickr
            className="input input-bordered w-full"
            value={dueDate || ''}
            onChange={dates => setDueDate(dates[0] || null)}
            options={{
              enableTime: true,
              dateFormat: 'Y-m-d H:i',
              minDate: 'today',
              time_24hr: true,
              allowInput: true
            }}
          />
        </div>
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
        {Object.keys(errors).length > 0 && (
          <div className="text-red-500 text-sm">
            Please fix the errors above to continue
          </div>
        )}
        <div className="flex gap-2 justify-end mt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">{initialTask.id ? 'Save' : 'Add'}</Button>
        </div>
      </form>
    <Toast />
    </motion.div>
  );
}
