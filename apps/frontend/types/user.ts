export type UserRole = 'TECNICO' | 'COORDINADOR' | 'ADMIN';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  isActive: boolean;
  failedLoginAttempts: number;
  lockedUntil: string | null;
}
