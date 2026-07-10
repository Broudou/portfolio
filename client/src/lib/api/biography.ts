import type { Biography, UpdateBiographyInput } from '@portfolio/shared';
import { apiFetch } from './client.js';

export function getBiography(): Promise<Biography> {
  return apiFetch<Biography>('/biography');
}

export function updateBiography(token: string, payload: UpdateBiographyInput): Promise<Biography> {
  return apiFetch<Biography>('/biography', { method: 'PUT', token, body: payload });
}
