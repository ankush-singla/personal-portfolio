/**
 * Post-build prerender step.
 *
 * The site is a client-side React app: the shipped index.html is an empty shell,
 * so tools that read a URL without running JavaScript (ElevenLabs' reader, link
 * unfurlers, some crawlers) only ever see the <head> meta tags — a "preview",
 * never the article.
 *
 * This script runs after `vite build`. For the writing index and each on-site
 * post it takes the built index.html, swaps in route-correct <title>/description/
 * canonical/OG tags, and injects the actual readable content into a #prerender-seo
 * block. The result is written as dist/<route>/index.html.
 *
 * On the live site Vercel serves these static files directly (filesystem wins
 * over the catch-all rewrite in vercel.json), so a no-JS fetch now returns the
 * full text. Real visitors still get the SPA: main.tsx removes #prerender-seo the
 * instant React boots, and the block is visually hidden until then.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import { getVisibleEntries, type WritingEntry } from '../src/data/writingEntries';

const ROOT = resolve(fileURLToPath(import.meta.url), '../..');
const DIST = join(ROOT, 'dist');
const SITE = 'https://ankushmsingla.com';

const template = readFileSync(join(DIST, 'index.html'), 'utf8');

const formatDate = (iso: string) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const escapeAttr = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Read a post's markdown body straight from disk (no Vite glob in Node). */
function readPostBody(slug: string): string {
  return readFileSync(join(ROOT, 'src', 'content', 'posts', `${slug}.md`), 'utf8');
}

/**
 * Produce a route-specific HTML file from the built shell: fix the meta tags so
 * the preview matches the page, and inject readable content into #prerender-seo.
 */
function buildPage(opts: {
  routePath: string; // e.g. 'writing' or 'writing/super-bowl-...'
  title: string;
  description: string;
  body: string; // inner HTML for the #prerender-seo block
}) {
  const url = `${SITE}/${opts.routePath}`;
  const fullTitle = `${opts.title} — Ankush Singla`;
  let html = template;

  // <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(fullTitle)}</title>`);

  // name= and property= meta content for the tags that carry the preview text
  const setMeta = (key: 'name' | 'property', name: string, value: string) => {
    const re = new RegExp(`(<meta\\s+${key}="${name}"\\s+content=")[\\s\\S]*?(")`, 'i');
    if (re.test(html)) html = html.replace(re, `$1${escapeAttr(value)}$2`);
  };
  setMeta('name', 'description', opts.description);
  setMeta('property', 'og:title', fullTitle);
  setMeta('property', 'og:description', opts.description);
  setMeta('property', 'og:url', url);
  setMeta('name', 'twitter:title', fullTitle);
  setMeta('name', 'twitter:description', opts.description);

  // canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${escapeAttr(url)}" />`
  );

  // Inject the readable content next to the (empty) React root. Visually hidden
  // so visitors never flash it; main.tsx removes it once React mounts.
  const block = `<div id="prerender-seo" style="position:absolute;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;">${opts.body}</div>`;
  html = html.replace('<div id="root"></div>', `<div id="root"></div>\n    ${block}`);

  const outDir = join(DIST, opts.routePath);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html);
  console.log(`  prerendered /${opts.routePath}`);
}

function entryCard(e: WritingEntry): string {
  const href =
    e.type === 'external' ? e.externalUrl : e.type === 'page' ? e.pageUrl : `/writing/${e.slug}`;
  return renderToStaticMarkup(
    <article>
      <h2>
        <a href={href}>{e.title}</a>
      </h2>
      <p>
        {formatDate(e.date)}
        {e.readingTime ? ` · ${e.readingTime}` : ''}
      </p>
      <p>{e.excerpt}</p>
    </article>
  );
}

const entries = getVisibleEntries();

// --- Writing index ---------------------------------------------------------
const indexBody =
  renderToStaticMarkup(
    <header>
      <h1>Writing</h1>
      <p>
        Notes on building products, leading teams, and the occasional lesson from sports.
        Originals live here, with links to anywhere they're also published.
      </p>
    </header>
  ) + entries.map(entryCard).join('');

buildPage({
  routePath: 'writing',
  title: 'Writing',
  description:
    "Writing by Ankush Singla — notes on building products, leading teams, and lessons from sports.",
  body: indexBody,
});

// --- Individual on-site posts ---------------------------------------------
for (const entry of entries) {
  if (entry.type !== 'post') continue;
  const body = readPostBody(entry.slug);

  const articleHtml =
    renderToStaticMarkup(
      <article>
        <p>
          {formatDate(entry.date)}
          {entry.readingTime ? ` · ${entry.readingTime}` : ''}
        </p>
        <h1>{entry.title}</h1>
      </article>
    ) +
    renderToStaticMarkup(<ReactMarkdown>{body}</ReactMarkdown>) +
    (entry.syndicatedTo?.length
      ? renderToStaticMarkup(
          <p>
            Also published on:{' '}
            {entry.syndicatedTo.map((s, i) => (
              <span key={s.url}>
                {i > 0 ? ', ' : ''}
                <a href={s.url}>{s.label}</a>
              </span>
            ))}
          </p>
        )
      : '');

  buildPage({
    routePath: `writing/${entry.slug}`,
    title: entry.title,
    description: entry.excerpt,
    body: articleHtml,
  });
}

console.log('Prerender complete.');
