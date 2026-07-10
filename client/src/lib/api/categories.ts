import type { Category, CreateCategoryInput, UpdateCategoryInput } from '@portfolio/shared';
import { apiFetch } from './client.js';

export function listCategories(): Promise<Category[]> {
  return apiFetch<Category[]>('/categories');
}

export function createCategory(token: string, payload: CreateCategoryInput): Promise<Category> {
  return apiFetch<Category>('/categories', { method: 'POST', token, body: payload });
}

export function updateCategory(
  token: string,
  id: string,
  payload: UpdateCategoryInput,
): Promise<Category> {
  return apiFetch<Category>(`/categories/${id}`, { method: 'PUT', token, body: payload });
}

export function deleteCategory(token: string, id: string): Promise<{ deleted: boolean }> {
  return apiFetch(`/categories/${id}`, { method: 'DELETE', token });
}
