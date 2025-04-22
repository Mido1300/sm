"use client";
import React, { useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { 
  Chart, 
  ArcElement, 
  BarElement, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { useTodos } from './TodoContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/types/task';

Chart.register(
  ArcElement, 
  BarElement, 
  CategoryScale, 
  LinearScale, 
  PointElement,
  LineElement,
  Title,
  Tooltip, 
  Legend,
  Filler
);

// Color palette for chart themes
const chartColors = {
  primary: 'rgba(37, 99, 235, 0.8)',
  secondary: 'rgba(249, 115, 22, 0.8)',
  success: 'rgba(16, 185, 129, 0.7)',
  danger: 'rgba(239, 68, 68, 0.7)',
  warning: 'rgba(245, 158, 11, 0.7)',
  info: 'rgba(14, 165, 233, 0.7)',
  light: 'rgba(107, 114, 128, 0.7)',
  dark: 'rgba(31, 41, 55, 0.7)',
  // Additional colors for category charts
  colors: [
    'rgba(37, 99, 235, 0.7)',
    'rgba(249, 115, 22, 0.7)',
    'rgba(16, 185, 129, 0.7)',
    'rgba(239, 68, 68, 0.7)',
    'rgba(245, 158, 11, 0.7)',
    'rgba(168, 85, 247, 0.7)',
    'rgba(236, 72, 153, 0.7)',
    'rgba(14, 165, 233, 0.7)',
  ],
  hoverColors: [
    'rgba(37, 99, 235, 0.9)',
    'rgba(249, 115, 22, 0.9)',
    'rgba(16, 185, 129, 0.9)',
    'rgba(239, 68, 68, 0.9)',
    'rgba(245, 158, 11, 0.9)',
    'rgba(168, 85, 247, 0.9)',
    'rgba(236, 72, 153, 0.9)',
    'rgba(14, 165, 233, 0.9)',
  ]
};

// Shared chart options for consistent styling
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: 20,
        font: {
          family: 'Poppins, sans-serif',
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(17, 24, 39, 0.8)',
      titleFont: {
        family: 'Poppins, sans-serif',
        size: 14
      },
      bodyFont: {
        family: 'Poppins, sans-serif',
        size: 13
      },
      padding: 12,
      cornerRadius: 8,
      caretSize: 6
    },
  },
};

// Task priority distribution component
function PriorityDistribution({ tasks }: { tasks: Task[] }) {
  const priorityCounts = {
    High: tasks.filter(t => t.priority === 'High').length,
    Medium: tasks.filter(t => t.priority === 'Medium').length,
    Low: tasks.filter(t => t.priority === 'Low').length,
  };

  const data = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        data: [priorityCounts.High, priorityCounts.Medium, priorityCounts.Low],
        backgroundColor: [chartColors.danger, chartColors.warning, chartColors.success],
        hoverBackgroundColor: [chartColors.danger, chartColors.warning, chartColors.success].map(c => c.replace('0.7', '0.9')),
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-64">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Priority Distribution</h3>
      <Pie 
        data={data} 
        options={{
          ...commonOptions,
          plugins: {
            ...commonOptions.plugins,
            tooltip: {
              ...commonOptions.plugins.tooltip,
              callbacks: {
                label: function(context: any) {
                  const value = context.raw;
                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${context.label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        }} 
      />
    </div>
  );
}

// Task completion trend component
function CompletionTrend({ tasks }: { tasks: Task[] }) {
  // Get last 14 days
  const today = new Date();
  const dates = [...Array(14)].map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (13 - i));
    return d.toISOString().slice(0, 10);
  });

  // Format dates for display
  const formattedDates = dates.map(d => {
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  // Count tasks created and completed per day
  const tasksCreated = dates.map(day =>
    tasks.filter(t => t.createdAt.slice(0, 10) === day).length
  );

  const tasksCompleted = dates.map(day =>
    tasks.filter(t => t.status === 'completed' && t.updatedAt.slice(0, 10) === day).length
  );

  const data = {
    labels: formattedDates,
    datasets: [
      {
        label: 'Created',
        data: tasksCreated,
        fill: true,
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderColor: chartColors.primary,
        tension: 0.4,
        pointBackgroundColor: chartColors.primary,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: 'Completed',
        data: tasksCompleted,
        fill: true,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderColor: chartColors.success,
        tension: 0.4,
        pointBackgroundColor: chartColors.success,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-64">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Task Trend (Last 14 Days)</h3>
      <Line 
        data={data} 
        options={{
          ...commonOptions,
          scales: {
            y: {
              beginAtZero: true,
              ticks: { precision: 0 },
              grid: {
                color: 'rgba(107, 114, 128, 0.1)',
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
        }} 
      />
    </div>
  );
}

// Task category distribution component
function CategoryDistribution({ tasks }: { tasks: Task[] }) {
  // Tasks per category
  const categoryCounts: Record<string, number> = {};
  for (const t of tasks) {
    const cat = t.category?.trim() || 'Uncategorized';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  }
  const categoryLabels = Object.keys(categoryCounts);
  const categoryData = categoryLabels.map(cat => categoryCounts[cat]);

  // Assign colors to categories
  const backgroundColors = categoryLabels.map((_, i) => chartColors.colors[i % chartColors.colors.length]);
  const hoverBackgroundColors = categoryLabels.map((_, i) => chartColors.hoverColors[i % chartColors.hoverColors.length]);

  const data = {
    labels: categoryLabels,
    datasets: [
      {
        label: 'Tasks',
        data: categoryData,
        backgroundColor: backgroundColors,
        hoverBackgroundColor: hoverBackgroundColors,
        borderWidth: 0,
        borderRadius: 6,
        maxBarThickness: 40,
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-64">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Tasks by Category</h3>
      <Bar 
        data={data} 
        options={{
          ...commonOptions,
          indexAxis: 'y' as const,
          scales: {
            x: {
              beginAtZero: true,
              ticks: { precision: 0 },
              grid: {
                color: 'rgba(107, 114, 128, 0.1)',
              },
            },
            y: {
              grid: {
                display: false,
              },
            },
          },
        }} 
      />
    </div>
  );
}

// Task completion status component
function CompletionStatus({ tasks }: { tasks: Task[] }) {
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const total = tasks.length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const data = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [completed, pending],
        backgroundColor: [chartColors.success, chartColors.danger],
        hoverBackgroundColor: [
          chartColors.success.replace('0.7', '0.9'),
          chartColors.danger.replace('0.7', '0.9')
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-64">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Task Status</h3>
        <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-sm font-medium px-2.5 py-0.5 rounded-full">
          {completionRate}% Complete
        </div>
      </div>
      <Pie 
        data={data} 
        options={{
          ...commonOptions,
          plugins: {
            ...commonOptions.plugins,
            tooltip: {
              ...commonOptions.plugins.tooltip,
              callbacks: {
                label: function(context: any) {
                  const value = context.raw;
                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${context.label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        }} 
      />
    </div>
  );
}

type ViewMode = 'graph' | 'list';

export default function Insights() {
  const { tasks } = useTodos();
  const [viewMode, setViewMode] = useState<ViewMode>('graph');
  
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Insights & Analytics</h2>
        
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <button 
            className={`px-4 py-2 rounded-md transition-all ${viewMode === 'graph' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-600 dark:text-gray-300'}`}
            onClick={() => setViewMode('graph')}
          >
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
              Graph View
            </span>
          </button>
          
          <button 
            className={`px-4 py-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-600 dark:text-gray-300'}`}
            onClick={() => setViewMode('list')}
          >
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              List View
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'graph' ? (
          <motion.div
            key="graph-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <CompletionStatus tasks={tasks} />
            <PriorityDistribution tasks={tasks} />
            <CompletionTrend tasks={tasks} />
            <CategoryDistribution tasks={tasks} />
          </motion.div>
        ) : (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-700 text-sm text-gray-500 dark:text-gray-300 uppercase">
                  <tr>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Due Date</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {tasks.map(task => (
                    <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 text-sm">
                      <td className="px-4 py-3 font-medium">{task.title}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        }`}>
                          {task.status === 'completed' ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                          {task.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {tasks.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No tasks found. Create some tasks to see them here.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
