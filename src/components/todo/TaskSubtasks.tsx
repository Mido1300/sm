import React from 'react';

export default function TaskSubtasks({ subtasks, onToggle }: { subtasks?: { id: string; title: string; completed: boolean }[]; onToggle: (idx: number) => void }) {
  if (!subtasks || subtasks.length === 0) return null;
  return (
    <ul className="mt-2 space-y-1">
      {subtasks.map((st, idx) => (
        <li key={st.id} className="flex items-center gap-2 pl-2">
          <input
            type="checkbox"
            checked={!!st.completed}
            onChange={() => onToggle(idx)}
            aria-label="Toggle subtask complete"
          />
          <span className={st.completed ? 'line-through text-gray-400' : ''}>{st.title}</span>
        </li>
      ))}
    </ul>
  );
}
