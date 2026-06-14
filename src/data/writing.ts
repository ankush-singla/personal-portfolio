/**
 * Writing hub content model.
 *
 * Two kinds of entries:
 *  - type: 'post'     → written here, rendered full-text on this domain. THIS is the
 *                       content that builds your SEO. Body lives in src/content/posts/<slug>.md
 *  - type: 'external' → lives elsewhere (LinkedIn, Forbes, a podcast). Shown as a card
 *                       that links out. Use this to surface writing you don't host here.
 *
 * Canonical-first strategy: write the original here, then syndicate OUT (LinkedIn,
 * dev.to, Medium) with a canonical link pointing back to this site. List those
 * syndication targets in `syndicatedTo` so readers can find the copies.
 */

export interface WritingEntry {
  slug: string;
  title: string;
  /** ISO date (YYYY-MM-DD) */
  date: string;
  excerpt: string;
  readingTime?: string;
  tags?: string[];
  type: 'post' | 'external';
  /** Required when type === 'external' */
  externalUrl?: string;
  /** Where an external piece was published, e.g. "Forbes", "LinkedIn" */
  externalSource?: string;
  /** Optional: where this on-site post is also syndicated */
  syndicatedTo?: { label: string; url: string }[];
  /** Mark true to hide from the public list (still routable if you share the link) */
  draft?: boolean;
}

export const WRITING: WritingEntry[] = [
  {
    slug: 'building-my-portfolio-as-an-ai-agent',
    title: 'I Built My Portfolio as an AI Agent',
    date: '2026-06-14',
    readingTime: '4 min read',
    excerpt:
      'Why an AI product leader should stay hands-on — and a walk through how this site was built across Stitch, AI Studio, and Antigravity, with a Gemini agent, MCP tooling, and LLM observability baked in.',
    tags: ['AI', 'Product', 'Build Notes'],
    type: 'post',
    draft: true,
    syndicatedTo: [
      { label: 'dev.to', url: 'https://dev.to/' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/singlaankush' },
    ],
  },
  {
    slug: 'fanduel-ace-ai-forbes',
    title: 'FanDuel Launches First AI Sports Betting Chat Experience',
    date: '2025-03-11',
    readingTime: 'Forbes',
    excerpt:
      'Forbes covers the launch of Ace — the first conversational AI assistant for sports bettors, which I led from concept at FanDuel.',
    tags: ['Press', 'GenAI', 'FanDuel'],
    type: 'external',
    externalSource: 'Forbes',
    externalUrl:
      'https://www.forbes.com/sites/mattrybaltowski/2025/03/11/fanduel-launches-first-ai-sports-betting-chat-experience/',
  },
];

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

export function getEntry(slug: string): WritingEntry | undefined {
  return WRITING.find((e) => e.slug === slug);
}

/** Public, sorted (newest first) list — hides drafts unless includeDrafts is set. */
export function getVisibleEntries(includeDrafts = false): WritingEntry[] {
  return [...WRITING]
    .filter((e) => includeDrafts || !e.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
