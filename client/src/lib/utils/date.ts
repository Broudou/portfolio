export function formatDate(iso: string | null | undefined, options?: Intl.DateTimeFormatOptions): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

export function formatMonthYear(iso: string | null | undefined): string {
  return formatDate(iso, { day: undefined });
}

export function toIsoDate(iso: string | null | undefined): string {
  if (!iso) return '';
  return new Date(iso).toISOString();
}
