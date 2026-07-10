import type { CreateTagInput, Tag, UpdateTagInput } from '@portfolio/shared';
import { apiFetch } from './client.js';

export function listTags(): Promise<Tag[]> {
  return apiFetch<Tag[]>('/tags');
}

export function createTag(token: string, payload: CreateTagInput): Promise<Tag> {
  return apiFetch<Tag>('/tags', { method: 'POST', token, body: payload });
}

export function updateTag(token: string, id: string, payload: UpdateTagInput): Promise<Tag> {
  return apiFetch<Tag>(`/tags/${id}`, { method: 'PUT', token, body: payload });
}

export function deleteTag(token: string, id: string): Promise<{ deleted: boolean }> {
  return apiFetch(`/tags/${id}`, { method: 'DELETE', token });
}
