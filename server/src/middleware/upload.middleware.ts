import crypto from 'node:crypto';
import path from 'node:path';
import multer from 'multer';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
]);

const storage = multer.diskStorage({
  destination: env.UPLOAD_DIR,
  filename: (_req, file, callback) => {
    const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${path.extname(file.originalname)}`;
    callback(null, uniqueName);
  },
});

const multerOptions = {
  storage,
  limits: { fileSize: env.MAX_UPLOAD_SIZE_MB * 1024 * 1024 },
  fileFilter: (_req: unknown, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      callback(ApiError.badRequest(`Unsupported file type: ${file.mimetype}`));
      return;
    }
    callback(null, true);
  },
};

export const uploadSingleImage = multer(multerOptions).single('file');

/** Multi-file upload used by the Photos admin (album photo batch-add). */
export const MAX_PHOTOS_PER_UPLOAD = 20;
export const uploadPhotos = multer(multerOptions).array('files', MAX_PHOTOS_PER_UPLOAD);
