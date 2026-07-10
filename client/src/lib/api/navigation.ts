import type {
  CreateNavigationItemInput,
  NavigationItem,
  UpdateNavigationItemInput,
} from '@portfolio/shared';
import { apiFetch } from './client.js';

export function listVisibleNavigation(): Promise<NavigationItem[]> {
  return apiFetch<NavigationItem[]>('/navigation');
}

export function listAllNavigation(token: string): Promise<NavigationItem[]> {
  return apiFetch<NavigationItem[]>('/navigation/all', { token });
}

export function createNavigationItem(
  token: string,
  payload: CreateNavigationItemInput,
): Promise<NavigationItem> {
  return apiFetch<NavigationItem>('/navigation', { method: 'POST', token, body: payload });
}

export function updateNavigationItem(
  token: string,
  id: string,
  payload: UpdateNavigationItemInput,
): Promise<NavigationItem> {
  return apiFetch<NavigationItem>(`/navigation/${id}`, { method: 'PUT', token, body: payload });
}

export function deleteNavigationItem(token: string, id: string): Promise<{ deleted: boolean }> {
  return apiFetch(`/navigation/${id}`, { method: 'DELETE', token });
}

export function reorderNavigation(
  token: string,
  items: { id: string; order: number }[],
): Promise<{ reordered: number }> {
  return apiFetch('/navigation/reorder', { method: 'PATCH', token, body: { items } });
}
