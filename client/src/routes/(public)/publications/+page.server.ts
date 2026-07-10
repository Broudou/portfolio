import type { PageServerLoad } from './$types.js';
import { listPublications } from '$lib/api/publications.js';

export const load: PageServerLoad = async () => {
  const publications = await listPublications();
  return { publications };
};
