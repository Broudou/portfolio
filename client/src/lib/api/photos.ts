import type { ApiResponse, Photo } from '@portfolio/shared';
import { API_BASE_URL } from '$lib/server/config.js';
import { apiFetch, ApiClientError } from './client.js';

export function listPhotosByAlbum(albumId: string, token?: string | null): Promise<Photo[]> {
  return apiFetch<Photo[]>(`/albums/${albumId}/photos`, { token });
}

/** Multipart upload — bypasses `apiFetch`'s JSON body handling since this sends `FormData`. */
export async function addPhotos(token: string, albumId: string, files: File[]): Promise<Photo[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const response = await fetch(`${API_BASE_URL}/albums/${albumId}/photos`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const json = (await response.json()) as ApiResponse<Photo[]>;
  if (!json.success) {
    throw new ApiClientError(response.status, json.error.code, json.error.message, json.error.details);
  }
  return json.data;
}

export function deletePhoto(token: string, id: string): Promise<{ deleted: boolean }> {
  return apiFetch(`/photos/${id}`, { method: 'DELETE', token });
}

export function reorderPhotos(
  token: string,
  albumId: string,
  items: { id: string; order: number }[],
): Promise<{ reordered: number }> {
  return apiFetch(`/albums/${albumId}/photos/reorder`, { method: 'PATCH', token, body: { items } });
}
