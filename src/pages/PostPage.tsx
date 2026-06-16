import { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { getEntry, getPostBody } from '../data/writing';
import { applyThemeToRoot } from '../utils/theme';
import { useApp } from '../context/AppContext';

const formatDate = (iso: string) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

/** Set or update a <meta name="..."> tag for basic per-post SEO. */
function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const entry = slug ? getEntry(slug) : undefined;
  const body = slug ? getPostBody(slug) : null;
  const { theme } = useApp();

  useEffect(() => {
    applyThemeToRoot(document.documentElement, theme);
    window.scrollTo(0, 0);
    if (entry) {
      document.title = `${entry.title} — Ankush Singla`;
      setMeta('description', entry.excerpt);
    }
  }, [entry, theme]);

  // Handle external redirect side-effects in useEffect
  useEffect(() => {
    if (entry && entry.type === 'external' && entry.externalUrl) {
      window.location.href = entry.externalUrl;
    }
  }, [entry]);

  if (entry && entry.type === 'external') {
    return null;
  }

  if (!entry || !body) {
    return <Navigate to="/writing" replace />;
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface relative overflow-x-clip selection:bg-copper selection:text-charcoal">
      <div className="noise-overlay" />

      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-suggested">
        <div className="max-w-[1800px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black tracking-tighter hover:text-copper transition-colors flex items-center">
            AS<span className="text-copper ml-1">_</span>
          </Link>
          <Link
            to="/writing"
            className="group inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] text-on-surface/50 hover:text-copper transition-colors"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            All writing
          </Link>
        </div>
      </header>

      <main className="pt-40 md:pt-48 px-6 pb-32">
        <article className="max-w-3xl mx-auto">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 border-b border-outline-suggested pb-10"
          >
            <div className="flex flex-wrap items-center gap-3 mb-5 text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="text-teal">{formatDate(entry.date)}</span>
              {entry.readingTime && (
                <>
                  <span className="text-on-surface/20">/</span>
                  <span className="text-on-surface/40">{entry.readingTime}</span>
                </>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] mb-6">
              {entry.title}
            </h1>
            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((t) => (
                  <span key={t} className="text-[10px] font-bold uppercase tracking-widest text-copper border border-copper/30 px-3 py-1 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </motion.header>

          <div className="post-prose font-serif text-lg leading-[1.85] text-on-surface/90">
            <ReactMarkdown>{body}</ReactMarkdown>
          </div>

          {entry.syndicatedTo && entry.syndicatedTo.length > 0 && (
            <footer className="mt-16 pt-8 border-t border-outline-suggested">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface/40 block mb-4">
                Also published on
              </span>
              <div className="flex flex-wrap gap-3">
                {entry.syndicatedTo.map((s) => (
                  <a
                    key={s.url}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-teal border border-teal/40 px-4 py-2 hover:bg-teal hover:text-charcoal transition-colors"
                  >
                    {s.label} <ExternalLink size={11} />
                  </a>
                ))}
              </div>
            </footer>
          )}
        </article>
      </main>
    </div>
  );
}
