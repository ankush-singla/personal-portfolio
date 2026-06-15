import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { getVisibleEntries } from '../data/writing';
import { applyThemeToRoot } from '../utils/theme';
import { useApp } from '../context/AppContext';

const formatDate = (iso: string) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export default function WritingIndex() {
  const entries = getVisibleEntries();
  const { theme } = useApp();

  useEffect(() => {
    applyThemeToRoot(document.documentElement, theme);
    document.title = 'Writing — Ankush Singla';
    window.scrollTo(0, 0);
  }, [theme]);

  return (
    <div className="min-h-screen bg-surface text-on-surface relative overflow-x-clip selection:bg-copper selection:text-charcoal">
      <div className="noise-overlay" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-suggested">
        <div className="max-w-[1800px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black tracking-tighter hover:text-copper transition-colors flex items-center">
            AS<span className="text-copper ml-1">_</span>
          </Link>
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] text-on-surface/50 hover:text-copper transition-colors"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to site
          </Link>
        </div>
      </header>

      <main className="pt-40 md:pt-48 px-6 md:px-24 pb-32">
        <div className="hidden md:flex absolute left-6 md:left-12 top-0 h-full items-start z-[55] pt-48">
          <span className="vertical-label sticky top-40">06 / Writing</span>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 md:mb-24 border-b border-outline-suggested pb-10"
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">Writing</h1>
            <p className="text-base md:text-lg font-light text-on-surface/70 max-w-2xl leading-relaxed">
              Notes on building products, leading teams, and the occasional lesson from
              sports. Originals live here, with links to anywhere they're also published.
            </p>
          </motion.div>

          <div className="divide-y divide-outline-suggested border-y border-outline-suggested">
            {entries.map((entry, i) => {
              const isExternal = entry.type === 'external';
              const Wrapper = ({ children }: { children: React.ReactNode }) =>
                isExternal ? (
                  <a href={entry.externalUrl} target="_blank" rel="noopener noreferrer" className="block group">
                    {children}
                  </a>
                ) : (
                  <Link to={`/writing/${entry.slug}`} className="block group">
                    {children}
                  </Link>
                );

              return (
                <motion.div
                  key={entry.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Wrapper>
                    <article className="py-8 md:py-10 transition-colors hover:bg-surface-low/40 -mx-4 px-4">
                      <div className="flex items-center gap-3 mb-3 text-[10px] font-black uppercase tracking-[0.2em]">
                        <span className="text-teal">{formatDate(entry.date)}</span>
                        {entry.readingTime && (
                          <>
                            <span className="text-on-surface/20">/</span>
                            <span className="text-on-surface/40">{entry.readingTime}</span>
                          </>
                        )}
                        {isExternal && (
                          <span className="ml-auto inline-flex items-center gap-1.5 border border-teal/40 text-teal px-2.5 py-1 rounded-full">
                            {entry.externalSource || 'External'} <ExternalLink size={9} />
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 group-hover:text-copper transition-colors">
                        {entry.title}
                      </h2>
                      <p className="text-on-surface/70 leading-relaxed font-light max-w-2xl mb-4">
                        {entry.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-copper opacity-70 group-hover:opacity-100 transition-opacity">
                        {isExternal ? 'Read on ' + (entry.externalSource || 'site') : 'Read post'}
                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </article>
                  </Wrapper>
                </motion.div>
              );
            })}
          </div>

          {entries.length === 0 && (
            <p className="text-on-surface/40 italic font-serif">First post coming soon.</p>
          )}
        </div>
      </main>
    </div>
  );
}
