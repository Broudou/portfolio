import type { Request, Response } from 'express';
import type { UpdateSettingInput } from '@portfolio/shared';
import { Setting, type SettingDocument } from '../models/index.js';
import { getOrCreateSingleton, updateSingleton } from '../services/singleton.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const SETTINGS_DEFAULTS: Partial<SettingDocument> = {
  siteTitle: 'Your Name',
  tagline: 'Software Engineer',
  footerText: `© ${new Date().getFullYear()} Your Name. All rights reserved.`,
  contactRecipientEmail: 'you@example.com',
  socialLinks: [],
  seoDefaults: { title: 'Your Name — Software Engineer', description: 'Personal portfolio.' },
  homepageSections: [
    { type: 'featuredProjects', enabled: true, order: 0, limit: 3 },
    { type: 'featuredArticles', enabled: true, order: 1, limit: 3 },
    { type: 'photos', enabled: true, order: 2, limit: 3 },
  ],
  homeBackground: { type: 'none', media: null },
};

export const getSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await getOrCreateSingleton(Setting, SETTINGS_DEFAULTS, 'homeBackground.media');
  sendSuccess(res, settings.toJSON());
});

export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  const patch = req.body as UpdateSettingInput;
  const settings = await updateSingleton(Setting, patch, 'homeBackground.media');
  sendSuccess(res, settings.toJSON());
});
