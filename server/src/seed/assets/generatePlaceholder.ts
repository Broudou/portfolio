/**
 * Generates a small, dependency-free abstract SVG placeholder so the seeded
 * "John Doe" content has visuals without shipping binary sample images in
 * the repo. Purely decorative — every real deployment replaces these via
 * the admin media library.
 */
export interface PlaceholderOptions {
  label: string;
  background: string;
  accent: string;
  width?: number;
  height?: number;
}

export function generatePlaceholderSvg({
  label,
  background,
  accent,
  width = 1200,
  height = 800,
}: PlaceholderOptions): string {
  const initials = label
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}">
  <rect width="${width}" height="${height}" fill="${background}" />
  <circle cx="${width * 0.78}" cy="${height * 0.22}" r="${Math.min(width, height) * 0.22}" fill="${accent}" opacity="0.16" />
  <circle cx="${width * 0.14}" cy="${height * 0.82}" r="${Math.min(width, height) * 0.16}" fill="${accent}" opacity="0.12" />
  <rect x="${width * 0.08}" y="${height * 0.08}" width="${width * 0.14}" height="${height * 0.14}" fill="none" stroke="${accent}" stroke-width="3" opacity="0.35" />
  <text x="50%" y="52%" text-anchor="middle" font-family="'JetBrains Mono', 'Courier New', monospace" font-size="${Math.round(Math.min(width, height) * 0.14)}" fill="${accent}" opacity="0.85">${initials}</text>
  <text x="50%" y="64%" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.round(width * 0.024)}" fill="#57534E" opacity="0.7">${label}</text>
</svg>`;
}
