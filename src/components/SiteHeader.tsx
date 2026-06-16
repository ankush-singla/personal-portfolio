import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Menu, X, ChevronRight, BookOpen, Code2 } from 'lucide-react';
import { RESUME_DATA } from '../data/resume';
import { ACHIEVEMENTS } from '../data/achievements';
import { useApp } from '../context/AppContext';

const navItems = RESUME_DATA.siteMetadata.sections.map(s => ({ label: s.label.split(' / ')[1], id: s.id }));

/**
 * Shared site navigation used on every route. Section links navigate to the
 * homepage with a hash (`/#work`); App.tsx scrolls to the target on arrival.
 * `activeSection` highlights the matching item — pass `"writing"` on the
 * writing routes so the Writing tab lights up like the on-page sections do.
 */
export default function SiteHeader({ activeSection }: { activeSection?: string }) {
  const {
    unlockedIds,
    enabled,
    setIsAchievementsModalOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  } = useApp();
  const { pathname } = useLocation();

  // Close the (globally-tracked) mobile menu whenever the route changes.
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname, setIsMobileMenuOpen]);

  const totalAchievements = Object.keys(ACHIEVEMENTS).length;
  const activeIndicator = (
    <motion.div
      layoutId="headerNav"
      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-copper shadow-[0_0_10px_rgba(235,94,40,0.8)]"
    />
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-[60] bg-surface/80 backdrop-blur-md border-b border-outline-suggested transition-all duration-500">
      <div className="max-w-[1800px] mx-auto px-6 h-20 flex items-center justify-between xl:grid xl:grid-cols-[1fr_auto_1fr]">
        {/* Brand Island (Left) */}
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-black tracking-tighter hover:text-copper transition-colors flex items-center group">
            AS
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "steps(1)" as any }}
              className="text-copper ml-1"
            >
              _
            </motion.span>
          </Link>
        </div>

        {/* Navigation Island (Center) */}
        <nav className="hidden xl:flex items-center justify-center gap-6 2xl:gap-10 whitespace-nowrap px-4 2xl:px-6">
          {navItems.slice(0, 4).map(item => (
            <Link
              key={item.id}
              to={`/#${item.id}`}
              className={`group relative text-[11px] font-semibold uppercase tracking-[0.25em] pl-[0.25em] transition-all hover:-translate-y-0.5 ${activeSection === item.id ? 'text-copper' : 'text-on-surface/70 hover:text-on-surface'}`}
            >
              {item.label}
              {activeSection === item.id && activeIndicator}
            </Link>
          ))}
          <span aria-hidden className="h-5 w-px bg-on-surface/25" />
          <Link
            to="/writing"
            className={`group relative inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] pl-[0.25em] transition-all hover:-translate-y-0.5 ${activeSection === 'writing' ? 'text-copper' : 'text-on-surface/70 hover:text-on-surface'}`}
          >
            <BookOpen size={13} className={activeSection === 'writing' ? 'text-copper' : 'text-copper/80 group-hover:text-copper transition-colors'} />
            Writing
            {activeSection === 'writing' && activeIndicator}
          </Link>
          <Link
            to="/build"
            className={`group relative inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] pl-[0.25em] transition-all hover:-translate-y-0.5 ${activeSection === 'build' ? 'text-copper' : 'text-on-surface/70 hover:text-on-surface'}`}
          >
            <Code2 size={13} className={activeSection === 'build' ? 'text-copper' : 'text-copper/80 group-hover:text-copper transition-colors'} />
            The Build
            {activeSection === 'build' && activeIndicator}
          </Link>
        </nav>

        {/* Action & Utility Island (Right) */}
        <div className="flex items-center justify-end gap-6 h-full">
          {/* Unified Achievement HUD - Visible on xl+ (collapses into the menu below that) */}
          <div className="hidden xl:flex items-center pr-4 2xl:pr-6 border-r border-outline-suggested/30">
            <button
              onClick={() => setIsAchievementsModalOpen(true)}
              className="group/achieve relative flex items-center gap-3 px-3 py-1 hover:bg-teal/5 rounded-full transition-colors 2xl:gap-4 2xl:px-4"
            >
              <div className="relative w-10 h-10 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="20" cy="20" r="18" className="stroke-on-surface/5 fill-none stroke-1" />
                  <motion.circle
                    cx="20" cy="20" r="18"
                    className="stroke-teal fill-none stroke-2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: unlockedIds.length / totalAchievements }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <Trophy size={14} className={`transition-all ${unlockedIds.length > 0 ? 'text-teal drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]' : 'text-on-surface/20'} group-hover/achieve:scale-110`} />

                {/* Integrated Active Status Light */}
                {enabled && (
                  <div className="absolute top-1 right-1">
                    <div className="w-1.5 h-1.5 bg-teal rounded-full shadow-[0_0_5px_rgba(20,184,166,1)] animate-pulse" />
                  </div>
                )}
              </div>
              <div className="flex flex-col text-left">
                <span className="hidden 2xl:block text-[8px] font-black uppercase tracking-widest text-on-surface/30 group-hover/achieve:text-teal transition-colors">Achievements</span>
                <span className="text-[10px] font-black text-teal leading-none">{unlockedIds.length}/{totalAchievements}</span>
              </div>
            </button>
          </div>

          <Link to="/#contact" className="hidden xl:inline-flex monolith-btn-primary py-2.5 px-6 text-[11px] uppercase tracking-[0.2em] font-black whitespace-nowrap">
            Contact
          </Link>

          <button
            className="xl:hidden p-2 -mr-2 text-on-surface hover:text-copper transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: '100vh', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="fixed inset-0 top-20 z-50 overflow-hidden bg-surface/95 backdrop-blur-xl"
          >
            <div className="px-8 py-12 flex flex-col h-full">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-black tracking-[0.3em] text-copper mb-4">Navigation</span>
                {navItems.map(item => (
                  <Link
                    key={item.id}
                    to={`/#${item.id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`group flex justify-between items-center py-5 border-b border-outline-suggested/30 text-sm font-black uppercase tracking-[0.2em] transition-colors ${activeSection === item.id ? 'text-copper' : 'text-on-surface/60 hover:text-on-surface'}`}
                  >
                    {item.label}
                    <ChevronRight size={18} className={`transition-transform ${activeSection === item.id ? 'text-copper translate-x-1' : 'text-on-surface/20'}`} />
                  </Link>
                ))}
                <Link
                  to="/writing"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`group flex justify-between items-center mt-4 py-5 border-b border-outline-suggested/30 text-sm font-black uppercase tracking-[0.2em] transition-colors ${activeSection === 'writing' ? 'text-copper' : 'text-on-surface/60 hover:text-on-surface'}`}
                >
                  <span className="inline-flex items-center gap-2.5">
                    <BookOpen size={15} className={activeSection === 'writing' ? 'text-copper' : 'text-copper/80'} />
                    Writing
                  </span>
                  <ChevronRight size={18} className={`transition-transform ${activeSection === 'writing' ? 'text-copper translate-x-1' : 'text-on-surface/20'}`} />
                </Link>
                <Link
                  to="/build"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`group flex justify-between items-center py-5 border-b border-outline-suggested/30 text-sm font-black uppercase tracking-[0.2em] transition-colors ${activeSection === 'build' ? 'text-copper' : 'text-on-surface/60 hover:text-on-surface'}`}
                >
                  <span className="inline-flex items-center gap-2.5">
                    <Code2 size={15} className={activeSection === 'build' ? 'text-copper' : 'text-copper/80'} />
                    The Build
                  </span>
                  <ChevronRight size={18} className={`transition-transform ${activeSection === 'build' ? 'text-copper translate-x-1' : 'text-on-surface/20'}`} />
                </Link>
              </div>

              {/* Mobile Achievement Stats */}
              <div className="mt-auto pb-32">
                <button
                  onClick={() => {
                    setIsAchievementsModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-surface-high/40 border border-outline-suggested/50 p-6 rounded-sm group active:scale-[0.98] transition-all"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <Trophy size={18} className="text-teal" />
                      <span className="text-xs font-black uppercase tracking-widest text-on-surface">Achievements</span>
                    </div>
                    <span className="text-sm font-black text-teal">{unlockedIds.length}/{totalAchievements}</span>
                  </div>
                  <div className="w-full h-1.5 bg-outline-suggested/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(unlockedIds.length / totalAchievements) * 100}%` }}
                      className="h-full bg-teal shadow-[0_0_10px_rgba(20,184,166,0.4)]"
                    />
                  </div>
                  <p className="text-[10px] uppercase font-bold tracking-[0.1em] text-on-surface/40 mt-4 text-left">
                    Tap to view progress & settings
                  </p>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
