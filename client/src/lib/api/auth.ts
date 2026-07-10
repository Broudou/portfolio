import type { LoginPayload, LoginResponse } from '@portfolio/shared';
import { apiFetch } from './client.js';

export function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', { method: 'POST', body: payload });
}

export function logout(token: string): Promise<{ loggedOut: boolean }> {
  return apiFetch('/auth/logout', { method: 'POST', token });
}
