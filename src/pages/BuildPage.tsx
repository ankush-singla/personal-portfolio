import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Github } from 'lucide-react';
import { applyThemeToRoot } from '../utils/theme';
import { useApp } from '../context/AppContext';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

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

/** How this was made — the actual generative-AI toolchain, by phase. */
const BUILT_WITH: { phase: string; tool: string }[] = [
  { phase: 'Design system', tool: 'Google Stitch' },
  { phase: 'Prototype & structure', tool: 'Google AI Studio' },
  { phase: 'Build & iterate', tool: 'Antigravity · Claude Code' },
  { phase: 'The brain', tool: 'Google Gemini' },
  { phase: 'Voice', tool: 'ElevenLabs' },
  { phase: 'Shipped on', tool: 'Vercel Edge' },
];

const STATS: { value: string; label: string }[] = [
  { value: '52', label: 'themes, summoned by asking' },
  { value: '8', label: 'things to discover' },
  { value: '5', label: 'AI tools in the build' },
  { value: '1', label: 'hidden theme to earn' },
];

export default function BuildPage() {
  const { theme, unlock } = useApp();

  // Visiting the build page unlocks "Behind the Build".
  useEffect(() => {
    unlock('behind-the-build');
  }, [unlock]);

  useEffect(() => {
    applyThemeToRoot(document.documentElement, theme);
    document.title = 'How I Built This — Ankush Singla';
    setMeta(
      'description',
      "Why this portfolio is built the way it is — a product leader's take on behavioral design, AI-driven personalization, and shipping emerging tech for real instead of demoing it.",
    );
    window.scrollTo(0, 0);
  }, [theme]);

  return (
    <div className="min-h-screen bg-surface text-on-surface relative overflow-x-clip selection:bg-copper selection:text-charcoal">
      <div className="noise-overlay" />

      <SiteHeader activeSection="build" />

      <main className="pt-40 md:pt-48 px-6 md:px-24 pb-32">
        <div className="hidden md:flex absolute left-6 md:left-12 top-0 h-full items-start z-[55] pt-48">
          <span className="vertical-label sticky top-40">07 / The Build</span>
        </div>

        <article className="max-w-3xl mx-auto">
          {/* Hero */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-14 border-b border-outline-suggested pb-10"
          >
            <div className="flex flex-wrap items-center gap-3 mb-5 text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="text-teal">The thinking behind it</span>
              <span className="text-on-surface/20">/</span>
              <span className="text-on-surface/40">~5 min read</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] mb-6">
              How I Built This
            </h1>
            <p className="text-base md:text-lg font-light text-on-surface/70 leading-relaxed max-w-2xl">
              Most portfolios tell you what someone shipped. I wanted to <em>show</em> you how I think
              about product &mdash; so I built the page to do it instead of describe it. It nudges, it
              rewards a little curiosity, and it leans on tech that&rsquo;s suddenly within reach for
              anyone &mdash; coder or not &mdash; to actually build with. Show, don&rsquo;t tell.
            </p>
            <p className="mt-6 max-w-2xl border-l-2 border-copper/40 pl-4 text-sm font-sans text-on-surface/55 leading-relaxed">
              Worth saying plainly: this page was drafted by an AI agent &mdash; pointed at my own commit
              history and told to write in my voice &mdash; then reviewed, edited, and signed off by me.
              The AI wrote the first draft; a human stayed in the loop for the judgment &mdash; which feels
              like the only honest way to write a page about building with AI.
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
            {/* The intent */}
            <section>
              <SectionHead index="01" eyebrow="The intent" title="Show, don&rsquo;t tell" />
              <p className="mb-5">
                I lead AI product for a living. A résumé is a brochure &mdash; a tidy list of highlights
                that asks you to imagine the rest. I&rsquo;d rather just show you the product. So everything
                here &mdash; what you can poke at, what rewards you for poking, what happens when you
                actually ask it something &mdash; reflects how I think a product should treat the person
                using it.
              </p>
              <p>
                Three beliefs run underneath all of it: earn attention instead of demanding it, reward
                curiosity, and use genuinely new capabilities to do something that was hard a year ago.
                The rest of this page is just those three ideas, made literal.
              </p>
            </section>

            {/* Behavioral design */}
            <section>
              <SectionHead index="02" eyebrow="Behavioral design" title="Built to be poked at" />
              <p className="mb-5">
                Start with an honest problem: I&rsquo;ve got a long career, and almost nobody wants to
                scroll through all of it. So a lot of the fussing went into making sure they don&rsquo;t
                have to. The career timeline is sticky and jumpable &mdash; you can land on any role without
                dragging past the rest &mdash; and a small pill follows you up the page, always offering the
                next stop instead of making you hunt for it. (That&rsquo;s the &ldquo;Next: &hellip;&rdquo;
                button down in the corner.) Getting the sticky timeline, the sliding indicators, and the
                mobile reordering to behave took an embarrassing number of commits. Worth it: the page is
                long, but moving through it never feels like a chore.
              </p>
              <p className="mb-5">
                The other half is making the optional stuff tempting. You don&rsquo;t <em>have</em> to open
                a deep dive, talk to the assistant, or find the thing that&rsquo;s hidden &mdash; but there
                are eight small things to discover, and a payoff when you find them all. (There&rsquo;s also
                one theme the assistant is forbidden from naming until you earn it. Still not telling.)
              </p>
              <p>
                None of it is decoration &mdash; it&rsquo;s the same instinct I bring to real products.
                People won&rsquo;t wade through everything you put in front of them, so you cut the friction
                of moving forward and add a little reward for curiosity. Do both and they&rsquo;ll see far
                more of what you made than a wall of text would ever get them to.
              </p>
            </section>

            {/* AI personalization */}
            <section>
              <SectionHead index="03" eyebrow="Personalization" title="Tell it the vibe. Watch it change." />
              <p className="mb-5">
                Here&rsquo;s the part I think actually matters. Tell the site what you want &mdash;
                &ldquo;make it feel like a terminal,&rdquo; &ldquo;Tokyo at night,&rdquo; &ldquo;something
                warmer&rdquo; &mdash; and it restyles itself, live, while answering a question about my
                career in the same breath.
              </p>
              <p className="mb-5">
                That sounds small. It isn&rsquo;t. A few years ago, personalization like this meant a
                settings menu and a handful of themes a designer hand-built and an engineer hard-coded:
                rigid, expensive, and capped at whatever someone thought to anticipate. Now a model turns a
                fuzzy human sentence into a concrete product change, on demand &mdash; no menu, no presets
                you&rsquo;re trapped inside.
              </p>
              <p>
                That&rsquo;s the unlock I keep betting on at work: AI quietly collapsing the distance
                between what a person <em>means</em> and what a product <em>does</em>. Here it just happens
                to be paint &mdash; and because it&rsquo;s now cheap to extend, there are 50-some looks to
                summon. Adding one is a sentence, not a sprint.
              </p>
            </section>

            {/* Emerging tech, shipped */}
            <section>
              <SectionHead index="04" eyebrow="Emerging tech" title="A demo would&rsquo;ve been easier" />
              <p className="mb-5">
                It would have been simpler to fake all this. I didn&rsquo;t. The assistant is a real Gemini
                agent that actually knows my background. You can talk to it out loud &mdash; there&rsquo;s an
                ElevenLabs voice agent wired in, so it doesn&rsquo;t have to stay on the keyboard. It runs
                live on Vercel&rsquo;s edge, not a localhost screenshot. And it&rsquo;s watched: the
                conversations are observable, the endpoints are rate-limited, and if you try to jailbreak it,
                it&rsquo;ll cheerfully say &ldquo;nice try&rdquo; and note that it&rsquo;s being logged.
              </p>
              <p>
                That last part isn&rsquo;t a flex &mdash; it&rsquo;s the job. Shipping AI that behaves, that
                you can see, and that fails gracefully is the unglamorous half of doing this for real. So I
                built the small version of exactly that, right here, where you can press on it.
              </p>
            </section>

            {/* Built the way I work */}
            <section>
              <SectionHead index="05" eyebrow="How it was made" title="Hands on the tools" />
              <p className="mb-8">
                I tell teams that AI leaders have to stay hands-on &mdash; you can&rsquo;t evaluate what
                you&rsquo;ve never wrestled with. So I built this across the ecosystem, on purpose. Google
                Stitch laid down the design system. Google AI Studio handled the early prototyping and
                structure. Antigravity acted as the IDE agent for the gnarly parts &mdash; the timeline
                carousel, the responsive layout. And Claude Code did much of the iteration and the writing,
                including the page you&rsquo;re reading.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-outline-suggested border border-outline-suggested not-prose mb-8">
                {BUILT_WITH.map((b) => (
                  <div key={b.phase} className="bg-surface p-5">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-teal mb-2">{b.phase}</div>
                    <div className="text-sm font-sans text-on-surface/80 leading-snug">{b.tool}</div>
                  </div>
                ))}
              </div>
              <p>
                The tool list isn&rsquo;t the point. Staying close enough to the work to feel the same
                friction my teams feel &mdash; that&rsquo;s the point.
              </p>
            </section>

            {/* The point / the bigger bet */}
            <section>
              <SectionHead index="06" eyebrow="The point" title="Why any of this matters" />
              <p className="mb-5">
                Strip away the themes and the easter eggs and this site is a small bet, made concrete. I
                think the distance between what a person <em>means</em> and what a product <em>does</em> is
                collapsing fast &mdash; that the next generation of products will feel less like tools you
                operate and more like systems you talk to, that meet you where you are. This site is a
                simple version of what those products can do &mdash; built to showcase what&rsquo;s now
                possible, and to test it for myself.
              </p>
              <p className="mb-5">
                It&rsquo;s also never really &ldquo;done.&rdquo; It&rsquo;s less a finished product than a
                workshop I keep wandering back into &mdash; I keep adding to it and sharpening it as the
                tools get better. That&rsquo;s the part I enjoy most: building something good, then making
                it better.
              </p>
              <p>
                But that&rsquo;s really why I&rsquo;d rather show you the product than the brochure. How I
                built this &mdash; caring about the person on the other side, cutting the annoying parts, and
                reaching for new tech only where it genuinely makes things better &mdash; is how I think
                about any product, and any team I lead. If that&rsquo;s the kind of thinking you want in
                your corner, let&rsquo;s talk.
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
              So &mdash; go play with it. Ask for a vibe, find what&rsquo;s hidden, or read the source.
              It&rsquo;s all out in the open.
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

      <SiteFooter />
    </div>
  );
}
