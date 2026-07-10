/** Converts the ProjectForm.svelte submission into a payload matching createProjectSchema/updateProjectSchema. */
export function parseProjectForm(formData: FormData) {
  const techStack = String(formData.get('techStack') ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    title: formData.get('title'),
    slug: formData.get('slug') || undefined,
    summary: formData.get('summary'),
    descriptionMarkdown: formData.get('descriptionMarkdown'),
    coverImage: formData.get('coverImage') || null,
    techStack,
    role: formData.get('role') || undefined,
    links: {
      repoUrl: formData.get('repoUrl') || undefined,
      liveUrl: formData.get('liveUrl') || undefined,
      caseStudyUrl: formData.get('caseStudyUrl') || undefined,
    },
    category: formData.get('category') || null,
    tags: formData.getAll('tags'),
    status: formData.get('status'),
    featured: formData.get('featured') === 'on',
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate') || null,
    order: Number(formData.get('order') ?? 0),
    seo: {
      title: formData.get('seoTitle') || undefined,
      description: formData.get('seoDescription') || undefined,
    },
  };
}
