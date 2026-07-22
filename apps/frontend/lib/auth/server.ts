import { cookies } from 'next/headers';
import { ROLE_COOKIE, TOKEN_COOKIE, USERNAME_COOKIE } from './constants';

export interface ServerAuth {
  token: string;
  username: string;
  role: string;
}

export function getServerAuth(): ServerAuth | null {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return {
    token,
    username: cookieStore.get(USERNAME_COOKIE)?.value ?? '',
    role: cookieStore.get(ROLE_COOKIE)?.value ?? '',
  };
}
