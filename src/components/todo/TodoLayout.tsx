import React from 'react';
import { TodoProvider } from './TodoContext';
import AppLayout from '@/components/layout/AppLayout';

export default function TodoLayout({ children }: { children: React.ReactNode }) {
  return (
    <TodoProvider>
      <AppLayout>{children}</AppLayout>
    </TodoProvider>
  );
}
