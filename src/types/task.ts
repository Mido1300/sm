export type Priority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'pending' | 'completed';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: TaskStatus;
  priority: Priority;
  category: string;
  subtasks?: Subtask[];
  notes?: string;
  timer: number; // seconds
  createdAt: string;
  updatedAt: string;
  sharedLink?: string;
}
