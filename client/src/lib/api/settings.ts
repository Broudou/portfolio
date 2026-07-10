import type { Setting, UpdateSettingInput } from '@portfolio/shared';
import { apiFetch } from './client.js';

export function getSettings(): Promise<Setting> {
  return apiFetch<Setting>('/settings');
}

export function updateSettings(token: string, payload: UpdateSettingInput): Promise<Setting> {
  return apiFetch<Setting>('/settings', { method: 'PUT', token, body: payload });
}
