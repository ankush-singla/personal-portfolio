import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { GoogleGenAI } from "@google/genai";
import { RESUME_DATA } from "./src/data/resume";
import { ACHIEVEMENTS } from "./src/data/achievements";
import { SYSTEM_INSTRUCTION, getAchievementContext } from "./src/data/prompts";

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'local-api',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (req, res, next) => {
            // Only handle the exact /api/chat path for the AI bot locally.
            // Let sub-paths (like /api/chat/e/) fall through to the proxy below.
            if (req.url !== '/' && req.url !== '') {
              return next();
            }

            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => body += chunk);
              req.on('end', async () => {
                try {
                  if (!body) throw new Error("No request body received by server");
                  const { message, history, achievements = [] } = JSON.parse(body);
                  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
                  
                  if (!apiKey) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: 'GEMINI_API_KEY not found in .env' }));
                    return;
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

                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ text: responseText || "I'm sorry, I couldn't process that." }));
                } catch (error) {
                  console.error("Local API Error:", error);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ 
                    error: 'Local API Error', 
                    details: error instanceof Error ? error.message : String(error) 
                  }));
                }
              });
              return;
            }
            next();
          });
        }
      }
    ],
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.svg'],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâ€”file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/api/chat/': {
          target: 'https://us.i.posthog.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/chat/, ''),
        },
        '/api/collect': {
          target: 'https://us.i.posthog.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/collect/, ''),
        },
      },
    },
  };
});
