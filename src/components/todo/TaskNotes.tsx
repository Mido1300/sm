import React from 'react';

export default function TaskNotes({ notes }: { notes?: string }) {
  if (!notes?.trim()) return null;
  return (
    <div className="mt-1 px-3 py-1 bg-gray-50 dark:bg-gray-800 italic text-gray-600 dark:text-gray-400 rounded">
      {notes}
    </div>
  );
}
