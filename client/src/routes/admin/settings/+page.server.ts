import { fail } from '@sveltejs/kit';
import { HOMEPAGE_SECTION_TYPES, SOCIAL_PLATFORMS, updateSettingSchema } from '@portfolio/shared';
import type { Actions, PageServerLoad } from './$types.js';
import { getSettings, updateSettings } from '$lib/api/settings.js';
import { listMedia } from '$lib/api/media.js';
import { ApiClientError } from '$lib/api/client.js';

export const load: PageServerLoad = async ({ locals }) => {
  const [settings, mediaResult] = await Promise.all([
    getSettings(),
    listMedia(locals.token!, { limit: 100 }),
  ]);
  return { settings, media: mediaResult.items };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();

    const socialLinks = SOCIAL_PLATFORMS.map((platform) => ({
      platform,
      url: String(formData.get(`social_${platform}`) ?? '').trim(),
    })).filter((link) => link.url.length > 0);

    const homepageSections = HOMEPAGE_SECTION_TYPES.map((type, index) => ({
      type,
      enabled: formData.get(`section_${type}_enabled`) === 'on',
      order: Number(formData.get(`section_${type}_order`) ?? index),
      limit: Number(formData.get(`section_${type}_limit`) ?? 3),
    }));

    const raw = {
      siteTitle: formData.get('siteTitle'),
      tagline: formData.get('tagline'),
      footerText: formData.get('footerText'),
      contactRecipientEmail: formData.get('contactRecipientEmail'),
      socialLinks,
      seoDefaults: {
        title: formData.get('seoTitle'),
        description: formData.get('seoDescription'),
        twitterHandle: formData.get('twitterHandle') || undefined,
      },
      homepageSections,
      homeBackground: {
        type: formData.get('homeBackgroundType') || 'none',
        media: formData.get('homeBackgroundMedia') || null,
      },
    };

    const parsed = updateSettingSchema.safeParse(raw);
    if (!parsed.success) {
      return fail(400, { errors: parsed.error.flatten().fieldErrors });
    }

    try {
      await updateSettings(locals.token!, parsed.data);
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }

    return { success: true };
  },
};
