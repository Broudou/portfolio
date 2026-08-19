import { NavigationItem } from '../../models/index.js';

const ITEMS = [
  { label: 'Home', path: '/', order: 0 },
  { label: 'Biography', path: '/biography', order: 1 },
  { label: 'Projects', path: '/projects', order: 2 },
  { label: 'Articles', path: '/articles', order: 3 },
  { label: 'Photos', path: '/photos', order: 4 },
  { label: 'Contact', path: '/contact', order: 5 },
];

export async function seedNavigation(): Promise<void> {
  await NavigationItem.insertMany(
    ITEMS.map((item) => ({
      ...item,
      isExternal: false,
      isVisible: true,
      openInNewTab: false,
    })),
  );
}
