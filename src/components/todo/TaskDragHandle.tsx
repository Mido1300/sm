import React from 'react';

export default function TaskDragHandle() {
  return (
    <span
      className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 px-2"
      aria-label="Drag handle"
      tabIndex={0}
      role="button"
      title="Drag to reorder"
    >
      ⠿
    </span>
  );
}
