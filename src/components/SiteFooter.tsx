import { Link, useLocation } from 'react-router-dom';
import { RESUME_DATA } from '../data/resume';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/writing', label: 'Writing' },
  { to: '/build', label: 'The Build' },
];

/**
 * Shared site footer for the sub-pages (writing index, posts, build page).
 * Mirrors the homepage's footer line — copyright + vibe — and adds quick
 * navigation, hiding the link to whichever page you're currently on.
 */
export default function SiteFooter() {
  const { pathname } = useLocation();
  const { footer } = RESUME_DATA.siteMetadata;

  return (
    <footer className="border-t border-outline-suggested px-6 md:px-24 pt-10 pb-40">
      <div className="max-w-[1800px] mx-auto flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {LINKS.filter(l => l.to !== pathname).map(l => (
            <Link
              key={l.to}
              to={l.to}
              className="text-[10px] uppercase tracking-[0.2em] text-on-surface/40 hover:text-copper transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="sm:text-right">
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 mb-1">{footer.copyright}</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-teal">{footer.vibe}</p>
        </div>
      </div>
    </footer>
  );
}
