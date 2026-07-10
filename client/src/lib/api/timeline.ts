import type {
  CreateTimelineEventInput,
  TimelineEvent,
  UpdateTimelineEventInput,
} from '@portfolio/shared';
import { apiFetch } from './client.js';

export function listTimelineEvents(): Promise<TimelineEvent[]> {
  return apiFetch<TimelineEvent[]>('/timeline');
}

export function createTimelineEvent(
  token: string,
  payload: CreateTimelineEventInput,
): Promise<TimelineEvent> {
  return apiFetch<TimelineEvent>('/timeline', { method: 'POST', token, body: payload });
}

export function updateTimelineEvent(
  token: string,
  id: string,
  payload: UpdateTimelineEventInput,
): Promise<TimelineEvent> {
  return apiFetch<TimelineEvent>(`/timeline/${id}`, { method: 'PUT', token, body: payload });
}

export function deleteTimelineEvent(token: string, id: string): Promise<{ deleted: boolean }> {
  return apiFetch(`/timeline/${id}`, { method: 'DELETE', token });
}
