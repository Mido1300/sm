import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, Subtask } from '@/types/task';
import { getFromLocalStorage, saveToLocalStorage } from '@/lib/localStorage';
import { exampleTasks } from '@/lib/exampleData';

interface Filters {
  search: string;
  status: string;
  priority: string;
  sort: string;
}

interface TodoContextValue {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  filteredTasks: Task[];
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const TodoContext = createContext<TodoContextValue | undefined>(undefined);

export function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error('useTodos must be used within TodoProvider');
  return ctx;
}

const defaultFilters: Filters = {
  search: '',
  status: '',
  priority: '',
  sort: 'dueDate',
};

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => getFromLocalStorage('tasks', exampleTasks));
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    saveToLocalStorage('tasks', tasks);
  }, [tasks]);

  // Filtering and sorting logic
  let filteredTasks = tasks.filter(task =>
    (!filters.search || task.title.toLowerCase().includes(filters.search.toLowerCase())) &&
    (!filters.status || task.status === filters.status) &&
    (!filters.priority || task.priority === filters.priority)
  );
  if (filters.sort === 'dueDate') filteredTasks = filteredTasks.sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));
  if (filters.sort === 'priority') filteredTasks = filteredTasks.sort((a, b) => ['High','Medium','Low'].indexOf(a.priority) - ['High','Medium','Low'].indexOf(b.priority));
  if (filters.sort === 'title') filteredTasks = filteredTasks.sort((a, b) => a.title.localeCompare(b.title));

  return (
    <TodoContext.Provider value={{ tasks, setTasks, filters, setFilters, filteredTasks, selectedIds, setSelectedIds }}>
      {children}
    </TodoContext.Provider>
  );
}
