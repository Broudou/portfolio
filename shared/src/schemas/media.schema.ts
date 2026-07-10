import { z } from 'zod';

/** Multer handles the binary upload itself; this only validates the alt-text field sent alongside it. */
export const uploadMediaSchema = z.object({
  altText: z.string().min(1).max(200),
});

export const updateMediaSchema = z.object({
  altText: z.string().min(1).max(200).optional(),
});

export type UploadMediaInput = z.infer<typeof uploadMediaSchema>;
export type UpdateMediaInput = z.infer<typeof updateMediaSchema>;
