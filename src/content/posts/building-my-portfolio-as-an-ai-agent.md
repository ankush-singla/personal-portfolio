> **Draft / starter post.** I scaffolded this from the deep-dive copy already on
> the site so the blog isn't empty on day one. Edit it into your own voice — or
> delete it and write the real first post. Set `draft: false` in
> `src/data/writing.ts` when you're ready to publish.

Effective AI executives have to stay hands-on. You can't set strategy for a
technology you've never wrestled with — you need to feel the friction, see where
the capabilities actually land, and understand what your teams can realistically
ship. So when it came time to rebuild my portfolio, I didn't hand it to a
template. I built it the way I'd want my teams to build: with AI in the loop at
every step.

## The stack behind the site

This site was assembled across a fluid ecosystem of tools rather than a single
IDE:

- **Google Stitch** defined the design system — the tokens, colors, and layout
  foundations everything else inherits from.
- **Google AI Studio** handled the rapid prototyping and the initial component
  architecture.
- **Google Antigravity** acted as the primary IDE agent, refining the harder
  logic: the timeline carousel, the responsive layouts, the theme engine.

The site itself is also an agent. The assistant in the corner is a
Gemini-backed bot that can answer questions about my background *and* re-theme
the entire page from a prompt — design system manipulation through natural
language. Behind it sits the kind of production scaffolding I care about: an
MCP-based tooling approach, intent classification on every response, guardrails
against prompt injection, and LLM observability wired through PostHog so I can
actually see how people interact with it.

## Why this matters

Most leaders *talk* about AI fluency. The point of building this way is that the
artifact proves it. Every design decision — staying hands-on, instrumenting for
observability, designing for responsible-AI guardrails — is the same discipline
I bring to shipping consumer GenAI products at scale.

By continually building across diverse AI ecosystems, I keep the hands-on
capability to lead AI product teams and drive enterprise AI transformation. The
portfolio is just the most public example.

---

*Want the architecture in more detail, or to compare notes on building
agentic products? [Get in touch](/#contact).*
