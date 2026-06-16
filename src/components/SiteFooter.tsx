import { Linkedin, Github, FileText, Mail } from 'lucide-react';
import { RESUME_DATA } from '../data/resume';
import { useApp } from '../context/AppContext';

const btnBase =
  'inline-flex items-center gap-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors';
const btnOutline = `${btnBase} border border-outline-suggested text-on-surface hover:bg-copper hover:text-charcoal hover:border-copper`;
const btnPrimary = `${btnBase} bg-copper text-charcoal border border-copper hover:bg-copper-deep`;

/**
 * Shared site footer for every route — a row of prominent action buttons
 * (contact form, résumé, socials) plus the copyright/vibe line. Padded at the
 * bottom so the floating ThemeBot controls don't overlap it. Each button counts
 * toward the Networker achievement.
 */
export default function SiteFooter() {
  const { unlock } = useApp();
  const { footer } = RESUME_DATA.siteMetadata;
  const { contactForm, resume, linkedin, github } = RESUME_DATA.contact;

  return (
    <footer className="border-t border-outline-suggested px-6 md:px-24 pt-10 pb-40">
      <div className="max-w-[1800px] mx-auto flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={contactForm}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => unlock('the-networker')}
            className={btnPrimary}
          >
            <Mail size={14} /> Get in Touch
          </a>
          {resume && (
            <a
              href={resume}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => unlock('the-networker')}
              className={btnOutline}
            >
              <FileText size={14} /> Résumé
            </a>
          )}
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => unlock('the-networker')}
            className={btnOutline}
          >
            <Linkedin size={14} /> LinkedIn
          </a>
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => unlock('the-networker')}
              className={btnOutline}
            >
              <Github size={14} /> GitHub
            </a>
          )}
        </div>
        <div className="lg:text-right">
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 mb-1">{footer.copyright}</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-teal">{footer.vibe}</p>
        </div>
      </div>
    </footer>
  );
}
