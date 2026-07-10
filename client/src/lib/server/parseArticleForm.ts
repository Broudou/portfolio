/** Converts the ArticleForm.svelte submission into a payload matching createArticleSchema/updateArticleSchema. */
export function parseArticleForm(formData: FormData) {
  return {
    title: formData.get('title'),
    slug: formData.get('slug') || undefined,
    excerpt: formData.get('excerpt'),
    contentMarkdown: formData.get('contentMarkdown'),
    coverImage: formData.get('coverImage') || null,
    category: formData.get('category') || null,
    tags: formData.getAll('tags'),
    status: formData.get('status'),
    featured: formData.get('featured') === 'on',
    seo: {
      title: formData.get('seoTitle') || undefined,
      description: formData.get('seoDescription') || undefined,
    },
  };
}
