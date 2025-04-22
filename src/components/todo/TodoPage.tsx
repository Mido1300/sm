import React, { useState } from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';
import BatchActionsBar from './BatchActionsBar';
import { Button } from '../ui/Button';
import { useTodos } from './TodoContext';

export default function TodoPage() {
  const [showForm, setShowForm] = useState(false);
  const { tasks } = useTodos();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">My Tasks</h2>
        <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">+ Add Task</Button>
      </div>
      <TaskFilters />
      <BatchActionsBar />
      <TaskList />
      {showForm && <TaskForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
