import React, { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useTodos } from './TodoContext';
import { Task, Priority, TaskStatus } from '@/types/task';

const priorities: Priority[] = ['High', 'Medium', 'Low'];
const statuses: TaskStatus[] = ['pending', 'completed'];

export default function TaskFilters() {
  const { filters, setFilters } = useTodos();
  const debouncedSearch = useDebounce(filters.search, 300);

  // When debouncedSearch changes, update filters.search
  React.useEffect(() => {
    setFilters(f => ({ ...f, search: debouncedSearch }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end mb-2">
      <input
        type="text"
        className="input input-bordered w-full sm:w-48"
        placeholder="Search tasks..."
        value={filters.search}
        onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
        aria-label="Search tasks"
      />
      <select
        className="input input-bordered w-full sm:w-36"
        value={filters.status}
        onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
        aria-label="Filter by status"
      >
        <option value="">All Status</option>
        {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
      </select>
      <select
        className="input input-bordered w-full sm:w-36"
        value={filters.priority}
        onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))}
        aria-label="Filter by priority"
      >
        <option value="">All Priorities</option>
        {priorities.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      <select
        className="input input-bordered w-full sm:w-36"
        value={filters.sort}
        onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}
        aria-label="Sort tasks"
      >
        <option value="dueDate">Sort by Due Date</option>
        <option value="priority">Sort by Priority</option>
        <option value="title">Sort by Title</option>
      </select>
    </div>
  );
}
