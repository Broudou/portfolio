/** Converts the AlbumForm.svelte submission into a payload matching createAlbumSchema/updateAlbumSchema. */
export function parseAlbumForm(formData: FormData) {
  return {
    title: formData.get('title'),
    slug: formData.get('slug') || undefined,
    description: formData.get('description') || undefined,
    cover: formData.get('cover') || null,
    status: formData.get('status'),
    featured: formData.get('featured') === 'on',
    order: Number(formData.get('order') ?? 0),
    seo: {
      title: formData.get('seoTitle') || undefined,
      description: formData.get('seoDescription') || undefined,
    },
  };
}
