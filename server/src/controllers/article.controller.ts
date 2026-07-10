import type { Request, Response } from 'express';
import type { CreateArticleInput, UpdateArticleInput } from '@portfolio/shared';
import { Article } from '../models/index.js';
import { generateUniqueSlug } from '../services/slug.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { buildPaginationMeta, sendPaginated, sendSuccess } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';

const POPULATE = ['category', 'tags', 'coverImage', 'author', 'seo.ogImage'];

export const listArticles = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const filter: Record<string, unknown> = {};

  // Anonymous callers only ever see published articles. An authenticated
  // admin/editor sees every status by default, or a specific one via ?status=.
  if (req.user) {
    if (req.query.status) filter.status = req.query.status;
  } else {
    filter.status = 'published';
  }
  if (req.query.category) filter.category = req.query.category;
  if (req.query.tag) filter.tags = req.query.tag;
  if (req.query.q) filter.$text = { $search: String(req.query.q) };

  const [items, total] = await Promise.all([
    Article.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate(POPULATE),
    Article.countDocuments(filter),
  ]);

  sendPaginated(res, items, buildPaginationMeta(total, page, limit));
});

export const getArticleBySlug = asyncHandler(async (req: Request, res: Response) => {
  const article = await Article.findOne({ slug: req.params.slug }).populate(POPULATE);
  if (!article) throw ApiError.notFound('Article');
  if (article.status !== 'published' && !req.user) throw ApiError.notFound('Article');
  sendSuccess(res, article);
});

export const createArticle = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as CreateArticleInput;
  const slug = input.slug ?? (await generateUniqueSlug(Article, input.title));
  const publishedAt = input.status === 'published' ? (input.publishedAt ?? new Date()) : null;
  const article = await Article.create({
    ...input,
    slug,
    publishedAt,
    author: req.user!.id,
  });
  sendSuccess(res, article, 201);
});

export const updateArticle = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as UpdateArticleInput;
  const patch: UpdateArticleInput & { publishedAt?: Date | null } = { ...input };

  if (input.status === 'published') {
    const existing = await Article.findById(req.params.id).select('publishedAt');
    if (existing && !existing.publishedAt) patch.publishedAt = new Date();
  }

  const article = await Article.findByIdAndUpdate(req.params.id, patch, {
    new: true,
    runValidators: true,
  }).populate(POPULATE);
  if (!article) throw ApiError.notFound('Article');
  sendSuccess(res, article);
});

export const deleteArticle = asyncHandler(async (req: Request, res: Response) => {
  const article = await Article.findByIdAndDelete(req.params.id);
  if (!article) throw ApiError.notFound('Article');
  sendSuccess(res, { deleted: true });
});
