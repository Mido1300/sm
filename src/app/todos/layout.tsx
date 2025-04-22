import TodoLayout from '@/components/todo/TodoLayout';

export default function TodosLayout({ children }: { children: React.ReactNode }) {
  return <TodoLayout>{children}</TodoLayout>;
}
