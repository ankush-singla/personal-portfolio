import { GoogleGenAI } from "@google/genai";
import { RESUME_DATA } from "../src/data/resume";
import { ACHIEVEMENTS } from "../src/data/achievements";
import { SYSTEM_INSTRUCTION, getAchievementContext } from "../src/data/prompts";

// Note: Using Node.js runtime instead of 'edge' to support the full @google/genai library and relative imports from /src

const ipMap = new Map<string, { count: number; lastTime: number }>();

export default async function handler(req: any, res: any) {
  const url = new URL(req.url!, `http://${req.headers.host}`);

  // --- PostHog Proxy Logic ---
  const isProxy = url.pathname.includes('/api/collect') || 
                  url.pathname.startsWith('/api/chat/') ||
                  url.pathname.startsWith('/api/metrics/');

  if (isProxy) {
    const path = url.pathname.replace(/^\/api\/(chat|collect|metrics)/, '') || '/';
    const posthogUrl = `https://us.i.posthog.com${path}${url.search}`;

    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      return res.status(204).end();
    }

    try {
      const response = await fetch(posthogUrl, {
        method: req.method,
        headers: req.headers as any,
        body: req.method !== 'GET' ? JSON.stringify(req.body) : null,
      });

      const resHeaders = response.headers;
      resHeaders.forEach((value, key) => {
        if (key.toLowerCase() !== 'content-encoding') {
          res.setHeader(key, value);
        }
      });
      res.setHeader('Access-Control-Allow-Origin', '*');

      const body = await response.arrayBuffer();
      return res.status(response.status).send(Buffer.from(body));
    } catch (err) {
      return res.status(500).json({ error: 'Proxy Error', details: err });
    }
  }

  // --- AI Chatbot Logic ---
  if (!url.pathname.endsWith('/chat')) {
    return res.status(404).json({ error: 'Not Found' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const ip = req.headers['x-forwarded-for'] || 'unknown';
  const now = Date.now();
  const rateData = ipMap.get(ip as string) || { count: 0, lastTime: now };

  if (now - rateData.lastTime < 2000 && rateData.count > 0) {
    return res.status(429).json({ error: "The free Google Gemini API isn't as reliable as Ankush is! It's currently taking a breather—please wait a moment." });
  }

  rateData.count += 1;
  rateData.lastTime = now;
  ipMap.set(ip as string, rateData);

  if (rateData.count > 15) {
    return res.status(403).json({ error: "Even the smartest AIs have off days! We've reached the maximum number of messages for this session." });
  }

  try {
    const { message, history, achievements = [] } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API Key missing' });
    }

    const allAchievementsList = Object.values(ACHIEVEMENTS).map(a => ({ id: a.id, hint: a.hint }));
    const lockedAchievements = allAchievementsList.filter(a => !achievements.includes(a.id));

    const achievementContext = getAchievementContext(
      achievements.length,
      allAchievementsList.length,
      lockedAchievements.map(a => a.hint)
    );

    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      systemInstruction: SYSTEM_INSTRUCTION + achievementContext
    });

    const result = await model.generateContent({
      contents: [
        ...(history || []),
        { role: 'user', parts: [{ text: message }] }
      ]
    });

    const responseText = result.response.text();

    return res.status(200).json({ text: responseText || "I'm sorry, I couldn't process that." });
  } catch (error) {
    return res.status(500).json({ 
      error: "Unfortunately, the free Google Gemini API isn't as reliable as Ankush is! Even the smartest AIs have off days.",
      details: error instanceof Error ? error.message : String(error)
    });
  }
}
