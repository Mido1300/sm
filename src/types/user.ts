export type UserRole = 'Manager' | 'Staff' | 'Customer' | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  createdAt: string;
}
