import React from 'react';

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function TaskTimer({ elapsed, running, onStart, onPause, onReset }: { elapsed: number; running: boolean; onStart: () => void; onPause: () => void; onReset: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-lg">{formatTime(elapsed)}</span>
      <button className="btn btn-primary" onClick={running ? onPause : onStart}>{running ? 'Pause' : 'Start'}</button>
      <button className="btn btn-secondary" onClick={onReset}>Reset</button>
    </div>
  );
}
