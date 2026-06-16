/**
 * Pure writing metadata — no Vite-only APIs in here, so this module can be
 * imported from plain Node scripts (e.g. the prerender step) as well as the app.
 * The markdown bodies are loaded separately in ./writing.ts (which uses Vite's
 * import.meta.glob and therefore only runs inside the browser/Vite build).
 *
 * Two kinds of entries:
 *  - type: 'post'     → written here, rendered full-text on this domain. THIS is the
 *                       content that builds your SEO. Body lives in src/content/posts/<slug>.md
 *  - type: 'external' → lives elsewhere (LinkedIn, Forbes, a podcast). Shown as a card
 *                       that links out. Use this to surface writing you don't host here.
 *  - type: 'page'     → an internal route on this site, e.g. '/build'
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
  type: 'post' | 'external' | 'page';
  /** Required when type === 'external' */
  externalUrl?: string;
  /** Required when type === 'page' — an internal route on this site, e.g. '/build' */
  pageUrl?: string;
  /** Where an external piece was published, e.g. "Forbes", "LinkedIn" */
  externalSource?: string;
  /** Optional: where this on-site post is also syndicated */
  syndicatedTo?: { label: string; url: string }[];
  /** Mark true to hide from the public list (still routable if you share the link) */
  draft?: boolean;
  /** Show a "Co-authored with AI" note alongside the title */
  coAuthoredWithAI?: boolean;
}

export const WRITING: WritingEntry[] = [
  {
    slug: 'how-i-built-this',
    title: 'How I Built This',
    date: '2026-06-15',
    readingTime: '5 min read',
    coAuthoredWithAI: true,
    excerpt:
      "A behind-the-scenes look at this site — the product thinking behind the playable bits, the generative-AI toolchain, and what it means to ship emerging tech for real instead of demoing it.",
    tags: ['Product', 'AI', 'Engineering'],
    type: 'page',
    pageUrl: '/build',
  },
  {
    slug: 'an-old-note-to-my-former-team',
    title: 'An Old Note to My Former Team',
    date: '2021-01-01',
    readingTime: '4 min read',
    excerpt:
      "A letter to my global product team on our company's Day of Reflection in the summer of 2020 — on change, gratitude, and choosing to make a moment as real as you want it to be.",
    tags: ['Leadership', 'Team Culture', 'Reflection'],
    type: 'post',
    syndicatedTo: [
      {
        label: 'Medium',
        url: 'https://medium.com/@singlaankush/an-old-note-to-my-former-team-c3ed46a2fcf2',
      },
    ],
  },
  {
    slug: 'super-bowl-coin-toss-business-strategy',
    title: 'Super Bowl Coin Tosses, Game Theory, and Business',
    date: '2024-02-13',
    readingTime: '3 min read',
    excerpt:
      "The 49ers won the overtime coin toss and lost the game — and the second-guessing that followed is a perfect mirror for how we judge business decisions without knowing the nuance. On strategy, execution, and the 'why.'",
    tags: ['Strategy', 'Sports', 'Leadership'],
    type: 'post',
    syndicatedTo: [
      {
        label: 'LinkedIn',
        url: 'https://www.linkedin.com/posts/singlaankush_justice-for-kyle-shanahan-barnwells-guide-activity-7165394099443863553-7pP8',
      },
    ],
  },
];

export function getEntry(slug: string): WritingEntry | undefined {
  return WRITING.find((e) => e.slug === slug);
}

/** Public, sorted (newest first) list — hides drafts unless includeDrafts is set. */
export function getVisibleEntries(includeDrafts = false): WritingEntry[] {
  return [...WRITING]
    .filter((e) => includeDrafts || !e.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
