import type {
  Article,
  CreateArticleInput,
  PaginatedResponse,
  UpdateArticleInput,
} from '@portfolio/shared';
import { apiFetch, buildQuery } from './client.js';

export interface ListArticlesParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  q?: string;
  status?: string;
  token?: string | null;
}

export function listArticles(params: ListArticlesParams = {}): Promise<PaginatedResponse<Article>> {
  const { token, ...query } = params;
  return apiFetch<PaginatedResponse<Article>>(`/articles${buildQuery(query)}`, { token });
}

export function getArticleBySlug(slug: string, token?: string | null): Promise<Article> {
  return apiFetch<Article>(`/articles/${slug}`, { token });
}

export function createArticle(token: string, payload: CreateArticleInput): Promise<Article> {
  return apiFetch<Article>('/articles', { method: 'POST', token, body: payload });
}

export function updateArticle(
  token: string,
  id: string,
  payload: UpdateArticleInput,
): Promise<Article> {
  return apiFetch<Article>(`/articles/${id}`, { method: 'PUT', token, body: payload });
}

export function deleteArticle(token: string, id: string): Promise<{ deleted: boolean }> {
  return apiFetch(`/articles/${id}`, { method: 'DELETE', token });
}
