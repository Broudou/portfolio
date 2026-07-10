import nodemailer, { type Transporter } from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

let transporter: Transporter | null = null;
let initialized = false;

function getTransporter(): Transporter | null {
  if (initialized) return transporter;
  initialized = true;

  if (!env.SMTP_HOST || !env.SMTP_PORT) {
    logger.info('SMTP not configured — email notifications are disabled (no-op).');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } : undefined,
  });
  return transporter;
}

interface SendMailInput {
  to: string;
  subject: string;
  text: string;
}

/** Best-effort send: logs and swallows errors so a broken SMTP config never breaks the request that triggered it. */
export async function sendMail({ to, subject, text }: SendMailInput): Promise<void> {
  const client = getTransporter();
  if (!client) return;

  try {
    await client.sendMail({ from: env.SMTP_FROM ?? env.SMTP_USER, to, subject, text });
  } catch (error) {
    logger.error({ err: error }, 'Failed to send email notification');
  }
}
