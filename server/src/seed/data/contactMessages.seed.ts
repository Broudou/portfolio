import { ContactMessage } from '../../models/index.js';

export async function seedContactMessages(): Promise<void> {
  await ContactMessage.insertMany([
    {
      name: 'Alicia Reyes',
      email: 'alicia.reyes@example.com',
      subject: 'Booking inquiry — Nocturne Sessions guest slot',
      message:
        "Hi Nadia, I caught the last Nocturne Sessions show and would love to be considered as a guest for a future date. I play upright bass and prepared piano — let me know if you're booking that far ahead.",
      isRead: true,
    },
    {
      name: 'Marco Lindqvist',
      email: 'marco.l@example.com',
      subject: 'Question about Tidal Drift on vinyl',
      message:
        "Loved the Tidal Drift cassette — any plans for a vinyl pressing? Would happily preorder if you open one up.",
      isRead: false,
    },
  ]);
}
