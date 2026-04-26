import { GoogleGenAI } from "@google/genai";
import { RESUME_DATA } from "../src/data/resume";
import { ACHIEVEMENTS } from "../src/data/achievements";
import { SYSTEM_INSTRUCTION, getAchievementContext } from "../src/data/prompts";

// Note: Using Node.js runtime instead of 'edge' to support the full @google/genai library and relative imports from /src

const ipMap = new Map<string, { count: number; lastTime: number }>();

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
      const response = await fetch(posthogUrl, {
        method: req.method,
        headers: req.headers,
        body: req.method !== 'GET' ? await req.text() : null,
      });

      const resHeaders = new Headers(response.headers);
      resHeaders.set('Access-Control-Allow-Origin', '*');

      return new Response(response.body, {
        status: response.status,
        headers: resHeaders,
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Proxy Error', details: err }), { status: 500 });
    }
  }

  // --- AI Chatbot Logic ---
  if (!url.pathname.endsWith('/chat')) {
    return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404 });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const rateData = ipMap.get(ip) || { count: 0, lastTime: now };

  if (now - rateData.lastTime < 2000 && rateData.count > 0) {
    return new Response(JSON.stringify({ error: "The free Google Gemini API isn't as reliable as Ankush is! It's currently taking a breather—please wait a moment." }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  rateData.count += 1;
  rateData.lastTime = now;
  ipMap.set(ip, rateData);

  if (rateData.count > 15) {
    return new Response(JSON.stringify({ error: "Even the smartest AIs have off days! We've reached the maximum number of messages for this session." }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { message, history, achievements = [] } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API Key missing' }), { status: 500 });
    }

    const allAchievementsList = Object.values(ACHIEVEMENTS).map(a => ({ id: a.id, hint: a.hint }));
    const lockedAchievements = allAchievementsList.filter(a => !achievements.includes(a.id));

    const achievementContext = getAchievementContext(
      achievements.length,
      allAchievementsList.length,
      lockedAchievements.map(a => a.hint)
    );

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...(history || []),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + achievementContext,
      }
    }); });

    return new Response(JSON.stringify({ text: response.text || "I'm sorry, I couldn't process that." }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: "Unfortunately, the free Google Gemini API isn't as reliable as Ankush is! Even the smartest AIs have off days.",
      details: error instanceof Error ? error.message : String(error)
    }), { status: 500 });
  }
}
