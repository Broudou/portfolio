export function parsePublicationForm(formData: FormData) {
  const coAuthors = String(formData.get('coAuthors') ?? '')
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);

  return {
    title: formData.get('title'),
    type: formData.get('type'),
    venue: formData.get('venue'),
    url: formData.get('url') || undefined,
    date: formData.get('date'),
    description: formData.get('description') || undefined,
    coAuthors,
    slidesUrl: formData.get('slidesUrl') || undefined,
    coverImage: formData.get('coverImage') || null,
  };
}
