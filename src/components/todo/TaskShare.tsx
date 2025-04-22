import React from 'react';

export default function TaskShare({ onShare }: { onShare: () => void }) {
  return (
    <button
      type="button"
      className="btn btn-secondary"
      onClick={onShare}
      aria-label="Share Task"
      title="Share Task"
    >
      
    </button>
  );
}
