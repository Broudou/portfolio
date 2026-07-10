export function parseTimelineEventForm(formData: FormData) {
  return {
    title: formData.get('title'),
    description: formData.get('description'),
    date: formData.get('date'),
    endDate: formData.get('endDate') || null,
    type: formData.get('type'),
    link: formData.get('link') || undefined,
  };
}
