import type { Request, Response } from 'express';
import type { CreateContactMessageInput } from '@portfolio/shared';
import { ContactMessage, Setting } from '../models/index.js';
import { getOrCreateSingleton } from '../services/singleton.service.js';
import { sendMail } from '../services/email.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { buildPaginationMeta, sendPaginated, sendSuccess } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { SETTINGS_DEFAULTS } from './setting.controller.js';

export const createContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body as CreateContactMessageInput;

  const contactMessage = await ContactMessage.create({
    name,
    email,
    subject,
    message,
    ipAddress: req.ip,
  });

  const settings = await getOrCreateSingleton(Setting, SETTINGS_DEFAULTS);

  void sendMail({
    to: settings.contactRecipientEmail,
    subject: `[Portfolio contact] ${subject}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });

  sendSuccess(res, contactMessage, 201);
});

export const listContactMessages = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));

  const [items, total] = await Promise.all([
    ContactMessage.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    ContactMessage.countDocuments(),
  ]);

  sendPaginated(res, items, buildPaginationMeta(total, page, limit));
});

export const getContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const message = await ContactMessage.findById(req.params.id);
  if (!message) throw ApiError.notFound('Message');
  sendSuccess(res, message);
});

export const markContactMessageRead = asyncHandler(async (req: Request, res: Response) => {
  const message = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { isRead: req.body.isRead ?? true },
    { new: true },
  );
  if (!message) throw ApiError.notFound('Message');
  sendSuccess(res, message);
});

export const deleteContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const message = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!message) throw ApiError.notFound('Message');
  sendSuccess(res, { deleted: true });
});
