/**
 * Writing hub — app-facing entry point.
 *
 * Pure metadata (the WRITING array, lookups) lives in ./writingEntries so it can
 * be imported from plain Node too (the prerender script). This module re-exports
 * all of that and adds the markdown-body loading, which relies on Vite's
 * import.meta.glob and therefore only works inside the browser/Vite build.
 */

export type { WritingEntry } from './writingEntries';
export { WRITING, getEntry, getVisibleEntries } from './writingEntries';

/** Eagerly load every markdown body in src/content/posts as a raw string, keyed by slug. */
const postBodies = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export function getPostBody(slug: string): string | null {
  const match = Object.entries(postBodies).find(([path]) =>
    path.endsWith(`/${slug}.md`)
  );
  return match ? match[1] : null;
}
