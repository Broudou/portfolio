import { fail } from '@sveltejs/kit';
import { updateBiographySchema } from '@portfolio/shared';
import type { Actions, PageServerLoad } from './$types.js';
import { getBiography, updateBiography } from '$lib/api/biography.js';
import { listMedia } from '$lib/api/media.js';
import { ApiClientError } from '$lib/api/client.js';

function linesToArray(value: FormDataEntryValue | null): string[] {
  return String(value ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export const load: PageServerLoad = async ({ locals }) => {
  const [biography, mediaResult] = await Promise.all([
    getBiography(),
    listMedia(locals.token!, { limit: 100 }),
  ]);
  return { biography, media: mediaResult.items };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();

    const raw = {
      fullName: formData.get('fullName'),
      headline: formData.get('headline'),
      summary: formData.get('summary'),
      bioMarkdown: formData.get('bioMarkdown'),
      location: formData.get('location') || undefined,
      avatar: formData.get('avatar') || null,
      skills: linesToArray(formData.get('skills')),
      highlights: linesToArray(formData.get('highlights')),
      seo: {
        title: formData.get('seoTitle') || undefined,
        description: formData.get('seoDescription') || undefined,
      },
    };

    const parsed = updateBiographySchema.safeParse(raw);
    if (!parsed.success) {
      return fail(400, { errors: parsed.error.flatten().fieldErrors });
    }

    try {
      await updateBiography(locals.token!, parsed.data);
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }

    return { success: true };
  },
};
