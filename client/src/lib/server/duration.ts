const UNIT_MS: Record<string, number> = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

/** Parses simple durations like "7d", "12h", "30m" (JWT_EXPIRES_IN) into milliseconds, for the auth cookie's maxAge. */
export function parseDurationMs(input: string): number {
  const match = /^(\d+)\s*(s|m|h|d)$/.exec(input.trim());
  if (!match) throw new Error(`Invalid duration string: "${input}"`);
  const [, amount, unit] = match;
  return Number(amount) * UNIT_MS[unit as string];
}
