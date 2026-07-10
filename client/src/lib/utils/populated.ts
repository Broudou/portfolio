/**
 * Shared entity types model refs as `T | string | null` because the API
 * *usually* returns them populated but the type can't guarantee it. Every
 * endpoint used by this client always populates its refs (see server
 * controllers), so this narrows the union back to `T | null` for templates.
 */
export function populated<T extends { id: string }>(value: T | string | null | undefined): T | null {
  return value && typeof value === 'object' ? value : null;
}
