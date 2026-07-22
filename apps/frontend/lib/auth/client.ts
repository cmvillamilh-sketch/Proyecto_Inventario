import { ROLE_COOKIE, TOKEN_COOKIE, TOKEN_MAX_AGE_SECONDS, USERNAME_COOKIE } from './constants';

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${TOKEN_MAX_AGE_SECONDS}`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`;
}

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setAuthCookies(token: string, username: string, role: string) {
  setCookie(TOKEN_COOKIE, token);
  setCookie(USERNAME_COOKIE, username);
  setCookie(ROLE_COOKIE, role);
}

export function clearAuthCookies() {
  clearCookie(TOKEN_COOKIE);
  clearCookie(USERNAME_COOKIE);
  clearCookie(ROLE_COOKIE);
}

export function getClientToken(): string | null {
  return readCookie(TOKEN_COOKIE);
}

export function getClientRole(): string | null {
  return readCookie(ROLE_COOKIE);
}

export function getClientUsername(): string | null {
  return readCookie(USERNAME_COOKIE);
}
