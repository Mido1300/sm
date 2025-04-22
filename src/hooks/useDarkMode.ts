import { useEffect, useState } from 'react';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    const saved = window.localStorage.getItem('theme');
    if (saved) {
      setIsDark(saved === 'dark');
      root.classList.toggle('dark', saved === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
      root.classList.toggle('dark', prefersDark);
    }
  }, []);

  const toggleDark = () => {
    setIsDark((prev) => {
      const next = !prev;
      window.localStorage.setItem('theme', next ? 'dark' : 'light');
      window.document.documentElement.classList.toggle('dark', next);
      return next;
    });
  };

  return [isDark, toggleDark] as const;
}
