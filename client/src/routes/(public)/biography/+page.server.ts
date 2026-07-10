import type { PageServerLoad } from './$types.js';
import { getBiography } from '$lib/api/biography.js';
import { renderMarkdown } from '$lib/utils/markdown.js';

export const load: PageServerLoad = async () => {
  const biography = await getBiography();
  const bioHtml = await renderMarkdown(biography.bioMarkdown);
  return { biography, bioHtml };
};
