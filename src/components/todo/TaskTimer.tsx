import React from 'react';
import { motion } from 'framer-motion';

function formatTime(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface TaskTimerProps {
  elapsed: number;
  running: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export default function TaskTimer({ elapsed, running, onStart, onPause, onReset }: TaskTimerProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
      <motion.span 
        className="font-mono text-xl font-bold tracking-wider"
        animate={{ scale: running ? [1, 1.05, 1] : 1 }}
        transition={{ repeat: running ? Infinity : 0, duration: 1 }}
      >
        {formatTime(elapsed)}
      </motion.span>
      
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-3 py-1 rounded-full flex items-center gap-1 text-white font-medium ${running ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-500 hover:bg-green-600'}`}
          onClick={running ? onPause : onStart}
          aria-label={running ? 'Pause timer' : 'Start timer'}
        >
          {running ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <rect x="6" y="4" width="3" height="12" rx="1" />
                <rect x="11" y="4" width="3" height="12" rx="1" />
              </svg>
              Pause
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Start
            </>
          )}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-1 font-medium"
          onClick={onReset}
          aria-label="Reset timer"
          disabled={elapsed === 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Reset
        </motion.button>
      </div>
    </div>
  );
}
