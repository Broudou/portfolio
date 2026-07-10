import type {
  CreateProjectInput,
  PaginatedResponse,
  Project,
  UpdateProjectInput,
} from '@portfolio/shared';
import { apiFetch, buildQuery } from './client.js';

export interface ListProjectsParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  q?: string;
  status?: string;
  token?: string | null;
}

export function listProjects(params: ListProjectsParams = {}): Promise<PaginatedResponse<Project>> {
  const { token, ...query } = params;
  return apiFetch<PaginatedResponse<Project>>(`/projects${buildQuery(query)}`, { token });
}

export function getProjectBySlug(slug: string, token?: string | null): Promise<Project> {
  return apiFetch<Project>(`/projects/${slug}`, { token });
}

export function createProject(token: string, payload: CreateProjectInput): Promise<Project> {
  return apiFetch<Project>('/projects', { method: 'POST', token, body: payload });
}

export function updateProject(
  token: string,
  id: string,
  payload: UpdateProjectInput,
): Promise<Project> {
  return apiFetch<Project>(`/projects/${id}`, { method: 'PUT', token, body: payload });
}

export function deleteProject(token: string, id: string): Promise<{ deleted: boolean }> {
  return apiFetch(`/projects/${id}`, { method: 'DELETE', token });
}

export function reorderProjects(
  token: string,
  items: { id: string; order: number }[],
): Promise<{ reordered: number }> {
  return apiFetch('/projects/reorder', { method: 'PATCH', token, body: { items } });
}
