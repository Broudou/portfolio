import { z } from 'zod';

export const createContactMessageSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  subject: z.string().min(1).max(160),
  message: z.string().min(1).max(4000),
  /**
   * Honeypot field: real users never see or fill this in (hidden via CSS),
   * bots usually do. Deliberately unconstrained here — the caller checks
   * `website` truthiness itself and pretends success without persisting
   * anything, so a filled-in value must survive validation to be checked.
   */
  website: z.string().optional().or(z.literal('')),
});

export type CreateContactMessageInput = z.infer<typeof createContactMessageSchema>;
