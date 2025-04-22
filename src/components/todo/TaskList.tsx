"use client";
import React, { useState } from 'react';
import { useTodos } from './TodoContext';
import { Task } from '@/types/task';
import { Button } from '../ui/Button';
import TaskDueDateIndicator from './TaskDueDateIndicator';
import TaskStatusToggle from './TaskStatusToggle';
import TaskShare, { ShareButton } from './TaskShare';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function TimerModal({ open, onClose, taskId }: { open: boolean; onClose: () => void; taskId: string }) {
  const [elapsed, setElapsed] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  React.useEffect(() => {
    if (!open) return;
    const stored = localStorage.getItem(`timer-${taskId}`);
    if (stored) {
      const { elapsed, running } = JSON.parse(stored);
      setElapsed(elapsed);
      setRunning(running);
    } else {
      setElapsed(0);
      setRunning(false);
    }
  }, [open, taskId]);
  React.useEffect(() => {
    if (!open) return;
    localStorage.setItem(`timer-${taskId}`,
      JSON.stringify({ elapsed, running })
    );
  }, [elapsed, running, open, taskId]);
  React.useEffect(() => {
    if (!running || !open) return;
    const interval = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(interval);
  }, [running, open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg w-80 relative">
        <button className="absolute top-2 right-2 text-lg" onClick={onClose} aria-label="Close">✖️</button>
        <div className="text-center">
          <div className="text-4xl font-mono mb-4">{formatTime(elapsed)}</div>
          <div className="flex gap-2 justify-center">
            <button className="btn btn-primary" onClick={() => setRunning(r => !r)}>{running ? 'Pause' : 'Start'}</button>
            <button className="btn btn-secondary" onClick={() => { setElapsed(0); setRunning(false); }}>Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SortableTaskItem({ task, selected, onSelect, onEdit, onDelete, onToggleComplete, onTimerClick, onShare, dragHandleProps }: any) {
  const { tasks, setTasks } = useTodos();
  function handleToggleSubtask(stIdx: number) {
    setTasks(tasks.map(t => t.id === task.id ? {
      ...t,
      subtasks: t.subtasks?.map((s, i) => i === stIdx ? { ...s, completed: !s.completed } : s)
    } : t));
  }
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  return (
    <motion.div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={`flex items-center gap-3 p-3 rounded shadow bg-white dark:bg-gray-800 border-l-4 ${task.priority === 'High' ? 'border-red-400' : task.priority === 'Medium' ? 'border-yellow-400' : 'border-green-400'} ${isDragging ? 'opacity-60' : ''}`}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={onSelect}
        aria-label="Select task"
        className="accent-primary"
      />
      <TaskStatusToggle status={task.status} onToggle={onToggleComplete} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-lg flex-1 truncate">
            {task.title}
            <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${task.category ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-600'}`}>
              {task.category?.trim() || 'Uncategorized'}
            </span>
            {task.priority && (
              <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${
                task.priority === 'High' ? 'bg-red-100 text-red-800' :
                task.priority === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {task.priority}
              </span>
            )}
            {task.dueDate && task.status !== 'completed' && (() => {
              const due = new Date(task.dueDate);
              const now = new Date();
              const diff = due.getTime() - now.getTime();
              if (diff < 0) {
                return <span className="ml-2 px-2 py-0.5 rounded text-xs font-semibold bg-red-200 text-red-800">Overdue</span>;
              } else if (diff < 24 * 3600 * 1000) {
                return <span className="ml-2 px-2 py-0.5 rounded text-xs font-semibold bg-yellow-200 text-yellow-800">Due soon</span>;
              }
              return null;
            })()}
          </span>
          <TaskDueDateIndicator dueDate={task.dueDate} status={task.status} />
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 flex gap-2">
          <span>{task.category}</span>
          <span className={`font-bold ${task.priority === 'High' ? 'text-red-500' : task.priority === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`}>{task.priority}</span>
        </div>
        {/* Subtasks */}
        {task.subtasks && task.subtasks.length > 0 && (
          <ul className="mt-2 space-y-1">
            {task.subtasks.map((st: import('@/types/task').Subtask, idx: number) => (
              <li key={st.id} className="flex items-center gap-2 pl-2">
                <input
                  type="checkbox"
                  checked={!!st.completed}
                  onChange={() => handleToggleSubtask(idx)}
                  aria-label="Toggle subtask complete"
                />
                <span className={st.completed ? 'line-through text-gray-400' : ''}>{st.title}</span>
              </li>
            ))}
          </ul>
        )}
        {/* Notes */}
        {task.notes && (
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 italic whitespace-pre-line">{task.notes}</div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 rounded"
          onClick={onEdit}
          aria-label="Edit task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded"
          onClick={onDelete}
          aria-label="Delete task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded"
          onClick={onTimerClick}
          aria-label="Task timer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.button>
        
        <ShareButton onClick={() => onShare(task)} />
      </div>
      <span
        className="cursor-move text-gray-400 ml-2"
        title="Drag to reorder"
        {...attributes}
        {...listeners}
        {...dragHandleProps}
        aria-label="Drag handle"
      >⠿</span>
    </motion.div>
  );
}

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

export default function TaskList() {
  const [timerTaskId, setTimerTaskId] = React.useState<string | null>(null);
  const [shareTaskId, setShareTaskId] = React.useState<string | null>(null);
  const { filteredTasks, tasks, setTasks, selectedIds, setSelectedIds } = useTodos();
  const [editingId, setEditingId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));
  const { showToast, Toast } = useToast();
  const [categoryFilter, setCategoryFilter] = React.useState<string>('');
  const [categories, setCategories] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setCategories(JSON.parse(localStorage.getItem('categories') || '[]'));
    }
  }, []);

  const visibleTasks = categoryFilter
    ? filteredTasks.filter(t => (t.category || '') === categoryFilter)
    : filteredTasks;

  function handleShareClick(task: Task) {
    setShareTaskId(task.id);
  }

  function handleDelete(id: string) {
    setTasks(tasks.filter(t => t.id !== id));
    setSelectedIds(selectedIds.filter(sid => sid !== id));
    showToast('Task deleted!');
  }

  function handleBatchDelete() {
    setTasks(tasks.filter(t => !selectedIds.includes(t.id)));
    setSelectedIds([]);
    showToast('Tasks deleted!');
  }

  function handleBatchComplete() {
    setTasks(tasks.map(t => selectedIds.includes(t.id) ? { ...t, status: 'completed' } : t));
    setSelectedIds([]);
    showToast('Tasks marked complete!');
  }

  function handleToggleComplete(id: string) {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t));
    showToast('Task status updated!');
  }
  function handleEdit(id: string) {
    setEditingId(id);
  }
  function handleSelect(id: string) {
    setSelectedIds(sel => sel.includes(id) ? sel.filter(s => s !== id) : [...sel, id]);
  }
  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = tasks.findIndex(t => t.id === active.id);
      const newIndex = tasks.findIndex(t => t.id === over.id);
      setTasks(arrayMove(tasks, oldIndex, newIndex));
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="mb-4 flex gap-2 items-center">
        <label className="font-medium">Filter by category:</label>
        <select
          className="input input-bordered"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="">All</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <SortableContext items={visibleTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {visibleTasks.map(task => (
              <SortableTaskItem
                key={task.id}
                task={task}
                selected={selectedIds.includes(task.id)}
                onSelect={() => handleSelect(task.id)}
                onEdit={() => handleEdit(task.id)}
                onDelete={() => handleDelete(task.id)}
                onToggleComplete={() => handleToggleComplete(task.id)}
                onTimerClick={() => setTimerTaskId(task.id)}
                onShare={() => handleShareClick(task)}
              />
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
      <TimerModal open={!!timerTaskId} onClose={() => setTimerTaskId(null)} taskId={timerTaskId ?? ''} />
      {shareTaskId && (
        <TaskShare 
          task={tasks.find(t => t.id === shareTaskId)!}
          onClose={() => setShareTaskId(null)} 
        />
      )}
      <Toast />
    </DndContext>
  );
}

