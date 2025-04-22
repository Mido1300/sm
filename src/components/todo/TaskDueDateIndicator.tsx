import React from 'react';
import { TaskStatus } from '@/types/task';

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}

interface TaskDueDateIndicatorProps {
  dueDate?: string;
  status: TaskStatus;
}

export default function TaskDueDateIndicator({ dueDate, status }: TaskDueDateIndicatorProps) {
  if (!dueDate) return <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-500">No due date</span>;
  const due = new Date(dueDate);
  const now = new Date();
  const diff = due.getTime() - now.getTime();
  let color = 'bg-gray-100 text-gray-700';
  let label = formatDate(dueDate);
  if (status === 'completed') {
    color = 'bg-green-100 text-green-700';
  } else if (diff < 0) {
    color = 'bg-red-100 text-red-700';
  } else if (diff < 24 * 3600 * 1000) {
    color = 'bg-yellow-100 text-yellow-700';
  }
  return <span className={`px-2 py-0.5 text-xs rounded font-mono ${color}`}>{label}</span>;
  else if (date > now) color = 'bg-green-500';
  return (
    <span className={`inline-block w-3 h-3 rounded-full ${color}`} title={`Due: ${date.toLocaleDateString()}`} />
  );
}
