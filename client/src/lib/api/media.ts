import type { ApiResponse, Media, PaginatedResponse } from '@portfolio/shared';
import { API_BASE_URL } from '$lib/server/config.js';
import { apiFetch, buildQuery, ApiClientError } from './client.js';

export function listMedia(
  token: string,
  params: { page?: number; limit?: number } = {},
): Promise<PaginatedResponse<Media>> {
  return apiFetch<PaginatedResponse<Media>>(`/media${buildQuery(params)}`, { token });
}

/** Multipart upload — bypasses `apiFetch`'s JSON body handling since this sends `FormData`. */
export async function uploadMedia(token: string, file: File, altText: string): Promise<Media> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('altText', altText);

  const response = await fetch(`${API_BASE_URL}/media`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const json = (await response.json()) as ApiResponse<Media>;
  if (!json.success) {
    throw new ApiClientError(response.status, json.error.code, json.error.message, json.error.details);
  }
  return json.data;
}

export function updateMedia(token: string, id: string, altText: string): Promise<Media> {
  return apiFetch<Media>(`/media/${id}`, { method: 'PUT', token, body: { altText } });
}

export function deleteMedia(token: string, id: string): Promise<{ deleted: boolean }> {
  return apiFetch(`/media/${id}`, { method: 'DELETE', token });
}
