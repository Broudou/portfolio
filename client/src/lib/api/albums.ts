import type { Album, CreateAlbumInput, PaginatedResponse, UpdateAlbumInput } from '@portfolio/shared';
import { apiFetch, buildQuery } from './client.js';

export interface ListAlbumsParams {
  page?: number;
  limit?: number;
  status?: string;
  token?: string | null;
}

export function listAlbums(params: ListAlbumsParams = {}): Promise<PaginatedResponse<Album>> {
  const { token, ...query } = params;
  return apiFetch<PaginatedResponse<Album>>(`/albums${buildQuery(query)}`, { token });
}

export function getAlbumBySlug(slug: string, token?: string | null): Promise<Album> {
  return apiFetch<Album>(`/albums/${slug}`, { token });
}

export function createAlbum(token: string, payload: CreateAlbumInput): Promise<Album> {
  return apiFetch<Album>('/albums', { method: 'POST', token, body: payload });
}

export function updateAlbum(token: string, id: string, payload: UpdateAlbumInput): Promise<Album> {
  return apiFetch<Album>(`/albums/${id}`, { method: 'PUT', token, body: payload });
}

export function deleteAlbum(token: string, id: string): Promise<{ deleted: boolean }> {
  return apiFetch(`/albums/${id}`, { method: 'DELETE', token });
}

export function reorderAlbums(
  token: string,
  items: { id: string; order: number }[],
): Promise<{ reordered: number }> {
  return apiFetch('/albums/reorder', { method: 'PATCH', token, body: { items } });
}
