/**
 * Permissive shape for the `form` prop SvelteKit passes to a page after an
 * action runs. Deliberately wider than SvelteKit's auto-inferred
 * `ActionData` (which unions the exact shape of every `fail()`/return call
 * in the file) because our actions intentionally return differently-shaped
 * payloads across branches (e.g. `{ errors }` for validation failures vs
 * `{ message }` for upstream API errors) — TypeScript disallows `?.`
 * property access across a union unless every branch has the property,
 * which this widened alias sidesteps while keeping everything optional.
 */
export interface FormResult {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
  values?: Record<string, unknown>;
  email?: string;
}
