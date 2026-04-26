import { GoogleGenAI } from "@google/genai";
import { RESUME_DATA } from "../src/data/resume";
import { ACHIEVEMENTS } from "../src/data/achievements";
import { SYSTEM_INSTRUCTION, getAchievementContext } from "../src/data/prompts";

// Note: Using Node.js runtime instead of 'edge' to support the full @google/genai library and relative imports from /src

const ipMap = new Map<string, { count: number; lastTime: number }>();

export default async function handler(req: any, res: any) {
  const { method, url = '', headers, body: reqBody } = req;

  // --- PostHog Proxy Logic ---
  // Matches /api/collect, /api/chat/..., /api/metrics/...
  const isPostHog = url.includes('/api/collect') || 
                    url.includes('/api/chat/') || 
                    url.includes('/api/metrics/');

  if (isPostHog) {
    const posthogPath = url.replace(/^\/api\/(chat|collect|metrics)/, '') || '/';
    const posthogUrl = `https://us.i.posthog.com${posthogPath}`;

    if (method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      return res.status(204).end();
    }

    try {
      const proxyHeaders = { ...headers };
      delete proxyHeaders['host'];
      delete proxyHeaders['connection'];

      const phResponse = await fetch(posthogUrl, {
        method,
        headers: proxyHeaders as any,
        body: method !== 'GET' ? (typeof reqBody === 'string' ? reqBody : JSON.stringify(reqBody)) : null,
      });

      res.setHeader('Access-Control-Allow-Origin', '*');
      const phData = await phResponse.arrayBuffer();
      return res.status(phResponse.status).send(Buffer.from(phData));
    } catch (err) {
      console.error("PostHog Proxy Error:", err);
      return res.status(500).json({ error: 'Proxy Error' });
    }
  }

  // --- AI Chatbot Logic ---
  if (!url.endsWith('/chat') || method !== 'POST') {
    return res.status(404).json({ error: 'Not Found' });
  }

  // Simple Rate Limiting
  const ip = (headers['x-forwarded-for'] || '127.0.0.1').toString().split(',')[0].trim();
  const now = Date.now();
  const rate = ipMap.get(ip) || { count: 0, lastTime: now };
  
  if (now - rate.lastTime < 1000 && rate.count > 0) {
    return res.status(429).json({ error: 'Slow down a bit!' });
  }
  
  rate.count++;
  rate.lastTime = now;
  ipMap.set(ip, rate);

  try {
    const { message, history, achievements = [] } = reqBody || {};
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API Key missing' });
    }

    if (!message) {
      return res.status(400).json({ error: 'No message provided' });
    }

    const allAchievements = Object.values(ACHIEVEMENTS).map(a => ({ id: a.id, hint: a.hint }));
    const lockedHints = allAchievements.filter(a => !achievements.includes(a.id)).map(a => a.hint);

    const context = getAchievementContext(achievements.length, allAchievements.length, lockedHints);

    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      systemInstruction: SYSTEM_INSTRUCTION + context
    });

    const result = await model.generateContent({
      contents: [...(history || []), { role: 'user', parts: [{ text: message }] }]
    });

    return res.status(200).json({ text: result.response.text() });
  } catch (error: any) {
    console.error("Chat Error:", error);
    return res.status(500).json({ 
      error: "AI is having a moment. Try again soon.",
      details: error.message 
    });
  }
}
