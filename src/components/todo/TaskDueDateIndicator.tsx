import React from 'react';
import { TaskStatus } from '@/types/task';
import { motion } from 'framer-motion';

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}

function formatRelativeTime(dateStr?: string) {
  if (!dateStr) return '';
  const due = new Date(dateStr);
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (diffMs < 0) {
    if (diffDays < -1) return `${Math.abs(diffDays)} days overdue`;
    return 'Overdue';
  }
  
  if (diffDays === 0) {
    if (diffHours === 0) return 'Due soon';
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} left`;
  }
  
  if (diffDays === 1) return 'Due tomorrow';
  return `${diffDays} days left`;
}

interface TaskDueDateIndicatorProps {
  dueDate?: string;
  status: TaskStatus;
}

export default function TaskDueDateIndicator({ dueDate, status }: TaskDueDateIndicatorProps) {
  if (!dueDate) {
    return <span className="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">No due date</span>;
  }
  
  const due = new Date(dueDate);
  const now = new Date();
  const diff = due.getTime() - now.getTime();
  const isPast = diff < 0;
  const isToday = diff >= 0 && diff < 24 * 3600 * 1000;
  const isCompleted = status === 'completed';
  
  // Determine color based on status and due date
  let bgColor = 'bg-gray-100 dark:bg-gray-700';
  let textColor = 'text-gray-700 dark:text-gray-300';
  let borderColor = 'border-gray-200 dark:border-gray-600';
  let icon = null;
  
  if (isCompleted) {
    bgColor = 'bg-green-50 dark:bg-green-900/20';
    textColor = 'text-green-700 dark:text-green-400';
    borderColor = 'border-green-200 dark:border-green-800';
    icon = (
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
      </svg>
    );
  } else if (isPast) {
    bgColor = 'bg-red-50 dark:bg-red-900/20';
    textColor = 'text-red-700 dark:text-red-400';
    borderColor = 'border-red-200 dark:border-red-800';
    icon = (
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-8.414l2.293-2.293a1 1 0 011.414 1.414L11.414 12l3.293 3.293a1 1 0 01-1.414 1.414L10 13.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 12 5.293 8.707a1 1 0 011.414-1.414L10 10.586z" clipRule="evenodd"/>
      </svg>
    );
  } else if (isToday) {
    bgColor = 'bg-yellow-50 dark:bg-yellow-900/20';
    textColor = 'text-yellow-700 dark:text-yellow-400'; 
    borderColor = 'border-yellow-200 dark:border-yellow-800';
    icon = (
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
      </svg>
    );
  } else {
    bgColor = 'bg-blue-50 dark:bg-blue-900/20';
    textColor = 'text-blue-700 dark:text-blue-400';
    borderColor = 'border-blue-200 dark:border-blue-800';
    icon = (
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
      </svg>
    );
  }
  
  return (
    <motion.div
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border ${bgColor} ${textColor} ${borderColor}`}
      title={`Due date: ${due.toLocaleString()}`}
    >
      {icon}
      <span className="font-medium">
        {formatRelativeTime(dueDate)}
      </span>
    </motion.div>
  );
}
