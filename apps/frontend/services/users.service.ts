import { API_BASE_URL } from '../lib/api';
import { User } from '../types/user';

export async function getUsers(token: string): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
}
