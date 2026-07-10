import type { ContactMessage, CreateContactMessageInput, PaginatedResponse } from '@portfolio/shared';
import { apiFetch } from './client.js';

export function submitContactMessage(payload: CreateContactMessageInput): Promise<ContactMessage> {
  return apiFetch<ContactMessage>('/contact', { method: 'POST', body: payload });
}

export function listContactMessages(
  token: string,
  params: { page?: number; limit?: number } = {},
): Promise<PaginatedResponse<ContactMessage>> {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  const qs = search.toString();
  return apiFetch<PaginatedResponse<ContactMessage>>(`/contact${qs ? `?${qs}` : ''}`, { token });
}

export function markContactMessageRead(
  token: string,
  id: string,
  isRead = true,
): Promise<ContactMessage> {
  return apiFetch<ContactMessage>(`/contact/${id}/read`, { method: 'PATCH', token, body: { isRead } });
}

export function deleteContactMessage(token: string, id: string): Promise<{ deleted: boolean }> {
  return apiFetch(`/contact/${id}`, { method: 'DELETE', token });
}
