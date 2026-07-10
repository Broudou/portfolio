import type {
  CreatePublicationInput,
  Publication,
  UpdatePublicationInput,
} from '@portfolio/shared';
import { apiFetch } from './client.js';

export function listPublications(): Promise<Publication[]> {
  return apiFetch<Publication[]>('/publications');
}

export function createPublication(
  token: string,
  payload: CreatePublicationInput,
): Promise<Publication> {
  return apiFetch<Publication>('/publications', { method: 'POST', token, body: payload });
}

export function updatePublication(
  token: string,
  id: string,
  payload: UpdatePublicationInput,
): Promise<Publication> {
  return apiFetch<Publication>(`/publications/${id}`, { method: 'PUT', token, body: payload });
}

export function deletePublication(token: string, id: string): Promise<{ deleted: boolean }> {
  return apiFetch(`/publications/${id}`, { method: 'DELETE', token });
}
