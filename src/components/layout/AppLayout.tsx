import { ReactNode } from 'react';
import DarkModeToggle from '@/components/ui/DarkModeToggle';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <header className="w-full flex items-center justify-between px-6 py-4 shadow bg-white dark:bg-gray-800">
        <h1 className="font-bold text-xl tracking-tight">Next.js Todo App</h1>
        <DarkModeToggle />
      </header>
      <main className="flex-1 flex flex-col w-full max-w-3xl mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="text-center py-4 text-xs text-gray-400 dark:text-gray-600">
        &copy; {new Date().getFullYear()} Next.js Todo App
      </footer>
    </div>
  );
}
