import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { useTodos } from './TodoContext';

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Insights() {
  const { tasks } = useTodos();
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = tasks.filter(t => t.status === 'pending').length;

  // Productivity: tasks completed per day (last 7 days)
  const today = new Date();
  const days = [...Array(7)].map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const completedPerDay = days.map(day =>
    tasks.filter(t => t.status === 'completed' && t.updatedAt.slice(0, 10) === day).length
  );

  // Tasks per category
  const categoryCounts: Record<string, number> = {};
  for (const t of tasks) {
    const cat = t.category?.trim() || 'Uncategorized';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  }
  const categoryLabels = Object.keys(categoryCounts);
  const categoryData = categoryLabels.map(cat => categoryCounts[cat]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Insights & Analytics</h2>
      <div className="mb-8">
        <h3 className="font-semibold mb-2">Task Status</h3>
        <Pie
          data={{
            labels: ['Completed', 'Pending'],
            datasets: [{
              data: [completed, pending],
              backgroundColor: ['#4ade80', '#f87171'],
            }],
          }}
        />
      </div>
      <div className="mb-8">
        <h3 className="font-semibold mb-2">Tasks per Category</h3>
        <Bar
          data={{
            labels: categoryLabels,
            datasets: [{
              label: 'Tasks',
              data: categoryData,
              backgroundColor: '#fbbf24',
            }],
          }}
          options={{
            scales: {
              y: { beginAtZero: true, ticks: { precision: 0 } },
            },
          }}
        />
      </div>
      <div>
        <h3 className="font-semibold mb-2">Tasks Completed (Last 7 Days)</h3>
        <Bar
          data={{
            labels: days,
            datasets: [{
              label: 'Completed',
              data: completedPerDay,
              backgroundColor: '#60a5fa',
            }],
          }}
          options={{
            scales: {
              y: { beginAtZero: true, ticks: { precision: 0 } },
            },
          }}
        />
      </div>
    </div>
  );
}
