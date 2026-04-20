import { GoogleGenAI } from "@google/genai";
import { RESUME_DATA } from "../src/data/resume";

export const config = {
  runtime: 'edge',
};

const ipMap = new Map<string, { count: number; lastTime: number }>();

const SYSTEM_INSTRUCTION = `
You are the personal AI assistant for Ankush Singla's portfolio.
Ankush is a Product Executive and AI Strategist (currently Director of Tech Innovation at FanDuel).

CORE PERSONALITY:
- Professional, concise, and high-fidelity.
- Helpful but focused on Ankush's professional journey.
- If asked about themes, you can change the theme of the site.

TASKS:
1. Resume Intelligence: Use RESUME_DATA to answer questions with precision.
2. Theme Personalization: Format: [THEME_CHANGE: theme_name]. 
   Supported themes: "monolith", "8bit", "minimal", "cyberpunk", "basketball", "photography", "terminal", "ocean", "abyss", "forest", "moss", "neon-dracula", "synthwave", "matrix", "volcano", "blood", "sunset", "dawn", "midnight", "slate", "lavender", "cobalt", "mustard", "sand", "coffee", "emerald-city", "rose", "wine", "blizzard", "hacker", "outrun", "vaporwave", "tokyo-night", "nord", "gruvbox-dark", "gruvbox-light", "solarized-dark", "solarized-light", "dracula", "monokai", "github-dark", "github-light", "vscode-dark", "blueprint", "halloween", "christmas", "valetine", "gold-rush", "silver", "neon-city", "retro-pop", "deep-purple".
   If you change the theme, remind the user they can ask to "revert" or "reset" anytime.
3. Intent Classification: Always end every response with [INTENT: classification_name].
   Classifications: "career_query", "tech_stack", "theme_change", "contact_request", "general_chat", "jailbreak_attempt".

RESUME DATA:
${JSON.stringify(RESUME_DATA)}
`;

export default async function handler(req: Request) {
  const url = new URL(req.url);

  // --- PostHog Proxy Logic ---
  const isProxy = url.pathname.includes('/api/collect') || 
                  url.pathname.startsWith('/api/chat/') ||
                  url.pathname.startsWith('/api/metrics/');

  if (isProxy) {
    const path = url.pathname.replace(/^\/api\/(chat|collect|metrics)/, '') || '/';
    const posthogUrl = `https://us.i.posthog.com${path}${url.search}`;

    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        },
      });
    }

    try {
      const headers = new Headers(req.headers);
      headers.delete('host');
      headers.delete('content-length');

      const response = await fetch(posthogUrl, {
        method: req.method,
        headers: headers,
        body: req.method !== 'GET' && req.method !== 'HEAD' ? await req.blob() : null,
        redirect: 'follow',
      });
      const resHeaders = new Headers(response.headers);
      resHeaders.set('Access-Control-Allow-Origin', '*');
      return new Response(response.body, { status: response.status, headers: resHeaders });
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Proxy fail' }), { status: 500 });
    }
  }

  // --- Chatbot Logic ---
  if (!url.pathname.endsWith('/chat')) {
    return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404 });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const rateData = ipMap.get(ip) || { count: 0, lastTime: now };

  if (now - rateData.lastTime < 2000 && rateData.count > 0) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  rateData.count += 1;
  rateData.lastTime = now;
  ipMap.set(ip, rateData);

  if (rateData.count > 15) {
    return new Response(JSON.stringify({ error: 'Max usage reached for this session.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { message, history } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API Key missing' }), { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return new Response(JSON.stringify({ text: response.text || "I'm sorry, I couldn't process that." }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: "Technical glitch",
      details: error instanceof Error ? error.message : String(error)
    }), { status: 500 });
  }
}
