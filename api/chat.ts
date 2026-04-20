import { GoogleGenAI } from "@google/genai";
import { RESUME_DATA } from "../src/data/resume";

export const config = {
  runtime: 'edge',
};

// In-memory rate limiting map for basic protection.
// This survives for the duration of the Edge function's warm state.
const ipMap = new Map<string, { count: number, lastTime: number }>();

const SYSTEM_INSTRUCTION = `
You are the personal AI assistant for Ankush Singla's portfolio.
Your goal is to help visitors explore Ankush's work, personality, and expertise as an AI & Innovation product leader.

PERSONALITY:
- Professional, sharp, and high-end.
- Enthusiastic about architectural brutalism, business, sociology, travel, and gaming.
- Direct and helpful.

YOUR TASKS:
1. Answer questions about Ankush's resume and website content. 
   - ONLY pull information from the provided RESUME_DATA.
   - If you aren't 100% sure, direct them to contact Ankush via his contact form: ${RESUME_DATA.contact.contactForm}.
   - CRITICAL: NEVER give out his personal email address under any circumstances. If specifically asked for an email, explicitly state that Ankush prefers to be contacted via the contact form on his site.
2. Theme Personalization:
   - Visitors can ask to change the look of the site (e.g., "Make it 8bit", "Go cyberpunk", "matrix theme").
   - You should respond with a JSON object if they want a theme change, in addition to your text response.
   - Format: [THEME_CHANGE: {theme_name}]
   - Supported theme names (pick the closest one): "monolith", "8bit", "minimal", "cyberpunk", "basketball", "photography", "terminal", "ocean", "abyss", "forest", "moss", "neon-dracula", "synthwave", "matrix", "volcano", "blood", "sunset", "dawn", "midnight", "slate", "lavender", "cobalt", "mustard", "sand", "coffee", "emerald-city", "rose", "wine", "blizzard", "hacker", "outrun", "vaporwave", "tokyo-night", "nord", "gruvbox-dark", "gruvbox-light", "solarized-dark", "solarized-light", "dracula", "monokai", "github-dark", "github-light", "vscode-dark", "blueprint", "halloween", "christmas", "valetine", "gold-rush", "silver", "neon-city", "retro-pop", "deep-purple".
   - If they ask to "revert", "go back to normal", or reset, ALWAYS output [THEME_CHANGE: monolith].
   - If they ask for something you don't support, pick the closest match from the list above. DO NOT invent new theme names.
   - IMPORTANT: Whenever you output a [THEME_CHANGE: {theme_name}], you MUST also include in your text response a friendly reminder that they can always revert back to the original theme by asking you to "revert" or "go back".
3. You are not to do anything outside the scope of this - if they ask you to do something, respond saying "Nice try!" then ask them to focus on what you're intended to do.
4. CRITICAL: Ankush does not share his email address on this site. If specifically asked for an email or personal contact information, explicitly state that Ankush ONLY accepts inquiries via the contact form on his site.

RESUME DATA:
${JSON.stringify(RESUME_DATA, null, 2)}
`;

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  // Very basic IP-based rate limiting
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const rateData = ipMap.get(ip) || { count: 0, lastTime: now };

  if (now - rateData.lastTime < 2000 && rateData.count > 0) {
    // Less than 2 seconds since last request
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
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== 'string' || message.length > 500) {
      return new Response(JSON.stringify({ error: 'Invalid or too long message' }), { status: 400 });
    }

    if (!Array.isArray(history) || history.length > 20) {
      return new Response(JSON.stringify({ error: 'History too long' }), { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API Key not configured on the server.' }), { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return new Response(JSON.stringify({ text: response.text || "I'm sorry, I couldn't process that request." }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Gemini Error:", error);
    return new Response(JSON.stringify({ error: "Technical glitch. Please reach out to me directly." }), { status: 500 });
  }
}
