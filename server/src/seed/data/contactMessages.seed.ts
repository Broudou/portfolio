import { ContactMessage } from '../../models/index.js';

export async function seedContactMessages(): Promise<void> {
  await ContactMessage.insertMany([
    {
      name: 'Alicia Reyes',
      email: 'alicia.reyes@example.com',
      subject: 'Speaking invitation — DevSummit 2026',
      message:
        "Hi John, we loved your talk on distributed tracing and would love to have you speak at DevSummit this year. Let me know if you'd be interested and I can send more details.",
      isRead: true,
    },
    {
      name: 'Marco Lindqvist',
      email: 'marco.l@example.com',
      subject: 'Question about the Schema Migrator CLI',
      message:
        "I saw the Schema Migrator project on your portfolio — is the beta open to external testers yet? Would love to try it against our staging MongoDB cluster.",
      isRead: false,
    },
  ]);
}
