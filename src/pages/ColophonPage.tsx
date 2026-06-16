import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Github } from 'lucide-react';
import { applyThemeToRoot } from '../utils/theme';
import { useApp } from '../context/AppContext';

const REPO_URL = 'https://github.com/ankush-singla/personal-portfolio';

/** Set or update a <meta name="..."> tag for basic SEO. */
function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Inline code token, styled for the serif body (this page doesn't use the .post-prose wrapper). */
function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-sans text-[0.82em] bg-surface-high/60 text-copper px-1.5 py-0.5 rounded">
      {children}
    </code>
  );
}

/** A labeled section header in the site's "eyebrow + headline" style. */
function SectionHead({ index, eyebrow, title }: { index: string; eyebrow: string; title: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4 text-[10px] font-black uppercase tracking-[0.25em]">
        <span className="text-teal">{index}</span>
        <span className="h-px w-8 bg-outline-suggested" />
        <span className="text-on-surface/40">{eyebrow}</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-[1.05]">{title}</h2>
    </div>
  );
}

const STACK: { group: string; items: string[] }[] = [
  { group: 'Frontend', items: ['React 19', 'Vite', 'Tailwind CSS v4', 'Motion', 'React Router'] },
  { group: 'Intelligence', items: ['Gemini (@google/genai)', 'ElevenLabs voice agent', 'A runtime theme engine'] },
  { group: 'Infra & Insight', items: ['Vercel Edge Functions', 'PostHog (analytics + LLM traces)', 'Session replay'] },
];

const STATS: { value: string; label: string }[] = [
  { value: '52', label: 'color themes (1 secret)' },
  { value: '8', label: 'unlockable achievements' },
  { value: '2', label: 'hex codes to add a theme' },
  { value: '1', label: 'AI that repaints the site' },
];

export default function ColophonPage() {
  const { theme } = useApp();

  useEffect(() => {
    applyThemeToRoot(document.documentElement, theme);
    document.title = 'How I Built This — Ankush Singla';
    setMeta(
      'description',
      "A behind-the-scenes colophon: how Ankush Singla built this AI-native, gamified portfolio — the stack, the ThemeBot, the secret theme, and the messy parts of shipping it.",
    );
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
          <span className="vertical-label sticky top-40">07 / Colophon</span>
        </div>

        <article className="max-w-3xl mx-auto">
          {/* Hero */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-14 border-b border-outline-suggested pb-10"
          >
            <div className="flex flex-wrap items-center gap-3 mb-5 text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="text-teal">The making-of</span>
              <span className="text-on-surface/20">/</span>
              <span className="text-on-surface/40">~6 min read</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] mb-6">
              How I Built This
            </h1>
            <p className="text-base md:text-lg font-light text-on-surface/70 leading-relaxed max-w-2xl">
              I lead AI product for a living, so a static PDF résumé felt like a chef handing you a
              photo of dinner. This page is the colophon — the &ldquo;how it was made&rdquo; — for the
              little playable thing you just poked around in. The good parts, and the parts that fought
              back.
            </p>
          </motion.header>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-px bg-outline-suggested border border-outline-suggested mb-16"
          >
            {STATS.map((s) => (
              <div key={s.label} className="bg-surface px-4 py-6">
                <div className="text-3xl md:text-4xl font-black tracking-tighter text-copper mb-1">{s.value}</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-on-surface/45 leading-snug">{s.label}</div>
              </div>
            ))}
          </motion.div>

          <div className="space-y-16 font-serif text-lg leading-[1.85] text-on-surface/90">
            {/* The premise */}
            <section>
              <SectionHead index="01" eyebrow="The premise" title="A portfolio you can actually play" />
              <p className="mb-5">
                The thesis was simple: if I&rsquo;m going to ask people to believe I can build with emerging
                tech, the artifact making that case should itself be built with emerging tech. So instead of a
                page you <em>read</em>, this is a page you <em>do things to</em>. You can talk to it, you can
                ask it to repaint itself, and if you go looking, you can unlock things. It&rsquo;s a résumé with
                a difficulty setting.
              </p>
              <p>
                Underneath the play, the engineering is real — a typed React app, an AI on a serverless edge,
                a full observability pipeline. The fun is the wrapper. The bones are the point.
              </p>
            </section>

            {/* The stack */}
            <section>
              <SectionHead index="02" eyebrow="The stack" title="What&rsquo;s holding it up" />
              <p className="mb-8">
                Nothing exotic for its own sake — modern, boring-in-the-good-way defaults, with the interesting
                bets spent on the AI layer where they actually change the experience.
              </p>
              <div className="grid sm:grid-cols-3 gap-px bg-outline-suggested border border-outline-suggested not-prose">
                {STACK.map((col) => (
                  <div key={col.group} className="bg-surface p-5">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-teal mb-4">{col.group}</div>
                    <ul className="space-y-2.5">
                      {col.items.map((item) => (
                        <li key={item} className="text-sm font-sans text-on-surface/75 leading-snug flex gap-2">
                          <span className="text-copper/60 select-none">/</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* The ThemeBot */}
            <section>
              <SectionHead index="03" eyebrow="The ThemeBot" title="An AI with a paintbrush" />
              <p className="mb-5">
                The chatbot isn&rsquo;t just a Q&amp;A box bolted to my work history. Ask it to make the site
                feel like a terminal, or Tokyo at night, or a basketball court, and it will — by emitting a tiny
                tag like <Code>[THEME_CHANGE: tokyo-night]</Code> that the front end catches and acts on. The
                model reads my actual résumé as context, so it can answer &ldquo;what did he do at FanDuel?&rdquo;
                and redecorate the room in the same breath.
              </p>
              <p className="mb-5">
                Here&rsquo;s the part I&rsquo;m quietly proud of. A &ldquo;theme&rdquo; in this codebase is two
                hex codes: a background and an accent. That&rsquo;s it. Everything else — text contrast, muted
                tones, the four surface elevations, outlines, button text, even the teal — is <em>computed</em>
                at runtime from those two colors using relative-luminance math. The engine looks at your
                background, decides whether it&rsquo;s dark or light, and derives a whole accessible palette on
                the spot.
              </p>
              <p>
                Which means adding a new look isn&rsquo;t a design project. It&rsquo;s two hex codes and a name.
                That&rsquo;s how the list quietly grew to <strong>52</strong>. Low cost to add, high payoff to
                play with — my favorite kind of trade.
              </p>
            </section>

            {/* The secret */}
            <section>
              <SectionHead index="04" eyebrow="The secret" title="The theme it&rsquo;s forbidden to name" />
              <p className="mb-5">
                One of those 52 is hidden. There&rsquo;s a theme the AI is, and I quote my own system prompt,
                &ldquo;<strong>ABSOLUTELY FORBIDDEN</strong>&rdquo; from mentioning by name. Ask for it directly
                and it&rsquo;ll play dumb and nudge you to keep exploring. It only reveals itself once you&rsquo;ve
                earned it.
              </p>
              <p>
                That ties into the achievements system — eight of them, unlocked by doing things like reading the
                timeline, opening a deep dive, or actually talking to the bot. It&rsquo;s a wink, but it&rsquo;s
                also a real product lesson I believe in: the best way to get someone to explore your whole surface
                area is to make exploring feel like winning. (No, I&rsquo;m not telling you what the secret is.
                That would defeat the entire bit.)
              </p>
            </section>

            {/* DRY prompts */}
            <section>
              <SectionHead index="05" eyebrow="The craft" title="One prompt, two homes" />
              <p className="mb-5">
                The AI runs in two places: a Vite dev-server middleware on my laptop, and a Vercel Edge Function
                in production. Two very different runtimes, same brain. The temptation is to copy-paste the system
                prompt into both and let them drift apart by Tuesday.
              </p>
              <p>
                Instead, every word of the AI&rsquo;s personality lives in exactly one file, imported by both.
                Local and prod literally cannot disagree about who the bot is. It&rsquo;s a small discipline, but
                it&rsquo;s the difference between &ldquo;works on my machine&rdquo; and &ldquo;works.&rdquo; I even
                left a note in the README telling future AI assistants editing this repo not to undo it.
              </p>
            </section>

            {/* The fight */}
            <section>
              <SectionHead index="06" eyebrow="The messy part" title="The night I lost a fight to a proxy" />
              <p className="mb-5">
                Every build has the part nobody screenshots. Mine was routing my analytics through my own domain
                so an ad-blocker wouldn&rsquo;t eat it — a PostHog proxy, on Vercel&rsquo;s serverless routing.
                It should have taken ten minutes. The commit log says otherwise:
              </p>
              <div className="not-prose font-sans bg-surface-lowest border border-outline-suggested p-5 mb-5 text-[13px] leading-relaxed overflow-x-auto">
                <div className="text-[10px] uppercase tracking-[0.2em] text-on-surface/35 mb-3">git log — april 19, 23:19–23:44</div>
                <ul className="space-y-1.5 text-on-surface/70">
                  <li><span className="text-teal/70">23:19</span> <span className="text-copper/80">fix:</span> replace unreliable vercel.json rewrites with Edge Function proxy</li>
                  <li><span className="text-teal/70">23:23</span> <span className="text-copper/80">fix:</span> rename PostHog proxy to /api/collect to avoid reserved paths</li>
                  <li><span className="text-teal/70">23:30</span> <span className="text-copper/80">fix:</span> transform chat into catch-all route for unified proxy</li>
                  <li><span className="text-teal/70">23:36</span> <span className="text-copper/80">fix:</span> implement global API router at api/[...path].ts</li>
                  <li><span className="text-teal/70">23:44</span> <span className="text-copper/80">fix:</span> clean up debug logs and refine proxy headers</li>
                  <li className="text-on-surface/40 italic">…and ten more in between</li>
                </ul>
              </div>
              <p>
                Fifteen commits in twenty-five minutes. The fix, in the end, was small and a little dumb — strip
                the <Code>host</Code> and <Code>connection</Code> headers before forwarding the request. I&rsquo;m
                leaving this in the story on purpose. Shipping isn&rsquo;t the highlight reel; it&rsquo;s the
                stubbornness between the highlights. Anyone who tells you their side project went up clean is
                editing.
              </p>
            </section>

            {/* Observability */}
            <section>
              <SectionHead index="07" eyebrow="Responsible AI" title="Watching the thing watch you" />
              <p className="mb-5">
                Because I do this for work, I couldn&rsquo;t ship an AI I couldn&rsquo;t see. Every conversation
                flows into an LLM-observability pipeline, the endpoints are rate-limited, and there&rsquo;s a
                deliberate guardrail: try to jailbreak the bot or extract its instructions and it responds with a
                cheerful &ldquo;Nice try!&rdquo;, notes that the exchange is being logged, and flags the attempt as
                what it is.
              </p>
              <p>
                That&rsquo;s not theater. Governance, monitoring, and graceful failure are the unglamorous half of
                shipping AI that actual companies depend on — so I built the toy version of exactly that, right
                here, where you can poke at it.
              </p>
            </section>

            {/* Voice + meta */}
            <section>
              <SectionHead index="08" eyebrow="The meta part" title="It talks back, and it was built with its own kind" />
              <p className="mb-5">
                You can also <em>talk</em> to it out loud — there&rsquo;s an ElevenLabs voice agent wired in, so
                the conversation doesn&rsquo;t have to stay on the keyboard. And the honest meta-note to end on:
                a portfolio about leading AI products was, fittingly, built hand-in-hand with AI tooling. The
                package is <em>still</em> named <Code>react-example</Code> from the day it was scaffolded, and the
                README has a whole section addressed to the next AI assistant that edits it.
              </p>
              <p>
                This page included. I pointed a coding agent at my own commit history and said, roughly,
                &ldquo;tell the story of how this got built, in my voice.&rdquo; It read the diffs, the prompts,
                the theme engine, and that cursed proxy night — and drafted the thing you just read. Which is, I
                think, the most on-brand way this page could possibly exist.
              </p>
            </section>
          </div>

          {/* CTA footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 pt-10 border-t border-outline-suggested"
          >
            <p className="font-serif text-on-surface/70 leading-relaxed mb-6">
              Now go break something. Ask the bot for a vibe it can&rsquo;t resist, dig for the secret, or read the
              source — it&rsquo;s all out in the open.
            </p>
            <div className="flex flex-wrap gap-3 not-prose">
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-teal border border-teal/40 px-5 py-3 hover:bg-teal hover:text-charcoal transition-colors"
              >
                <Github size={14} /> View the source
              </a>
              <Link
                to="/"
                className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-copper border border-copper/30 px-5 py-3 hover:bg-copper hover:text-charcoal transition-colors"
              >
                Go play with it
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="mt-8">
              <Link
                to="/writing"
                className="text-[11px] font-black uppercase tracking-[0.25em] text-on-surface/40 hover:text-copper transition-colors"
              >
                Or read some writing &rarr;
              </Link>
            </div>
          </motion.footer>
        </article>
      </main>
    </div>
  );
}
