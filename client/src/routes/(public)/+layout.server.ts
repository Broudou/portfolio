import type { LayoutServerLoad } from './$types.js';
import { listVisibleNavigation } from '$lib/api/navigation.js';
import { getSettings } from '$lib/api/settings.js';

export const load: LayoutServerLoad = async () => {
  const [navigation, settings] = await Promise.all([listVisibleNavigation(), getSettings()]);
  return {
    navigation: navigation.filter((item) => item.label.trim().toLowerCase() !== 'publications'),
    settings,
  };
};
