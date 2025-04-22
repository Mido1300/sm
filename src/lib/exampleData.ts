import { Task } from '@/types/task';
import { Category } from '@/types/category';
import { User } from '@/types/user';

export const exampleCategories: Category[] = [
  { id: '1', name: 'Work', color: '#6366f1', createdAt: new Date().toISOString() },
  { id: '2', name: 'Personal', color: '#f472b6', createdAt: new Date().toISOString() },
  { id: '3', name: 'Shopping', color: '#34d399', createdAt: new Date().toISOString() },
];

export const exampleUsers: User[] = [
  { id: '1', name: 'Alice Manager', email: 'alice@todo.com', avatar: '', role: 'Manager', createdAt: new Date().toISOString() },
  { id: '2', name: 'Bob Staff', email: 'bob@todo.com', avatar: '', role: 'Staff', createdAt: new Date().toISOString() },
];

export const exampleTasks: Task[] = [
  {
    id: '1',
    title: 'Finish Next.js Todo App',
    description: 'Implement all core features and polish UI/UX.',
    category: 'Work',
    priority: 'High',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    notes: 'Remember to add framer-motion animations.',
    subtasks: [
      { id: '1-1', title: 'Setup project structure', isCompleted: true },
      { id: '1-2', title: 'Implement CRUD', isCompleted: false },
    ],
    status: 'pending',
    timer: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sharedLink: '',
  },
  {
    id: '2',
    title: 'Buy groceries',
    description: 'Milk, eggs, bread, fruits',
    category: 'Shopping',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    notes: '',
    subtasks: [
      { id: '2-1', title: 'Buy milk', isCompleted: false },
      { id: '2-2', title: 'Buy eggs', isCompleted: false },
    ],
    status: 'pending',
    timer: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sharedLink: '',
  },
  // Add 8 more example tasks ...
];
