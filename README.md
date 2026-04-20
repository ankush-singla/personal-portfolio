# Ankush Singla | Personal Portfolio

An AI-native, gamified executive portfolio built to showcase career history, product philosophy, and technical proficiency. 

This project goes beyond a standard resume by integrating a custom generative AI agent (ThemeBot) that can answer questions about my background and dynamically change the site's visual theme based on user prompts.

## 🚀 Features

*   **Gamified Experience:** Users unlock achievements for interacting with the site (scrolling timelines, exploring deep dives, triggering themes).
*   **AI ThemeBot:** A custom Gemini-powered assistant that guides users and manipulates the CSS design system via prompt engineering.
*   **Executive Narrative:** A structured timeline of career progression, focused on 0-to-1 builds and enterprise scaling.
*   **Fully Responsive:** Fluid layouts built with Tailwind CSS that scale from massive monitors down to mobile viewports.

## 🛠️ Tech Stack

*   **Frontend:** React 19, Vite, Tailwind CSS v4
*   **Animations:** Motion (Framer Motion)
*   **AI Integration:** `@google/genai` (Gemini 3 Flash via Vercel Serverless Edge Functions)
*   **Deployment:** Vercel

## 💻 Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ankush-singla/personal-portfolio.git
   cd personal-portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory based on `.env.example`:
   ```bash
   GEMINI_API_KEY=your_google_gemini_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:3000`.

## 🚢 Deployment
This project is configured for seamless deployment on [Vercel](https://vercel.com). Simply import the repository and ensure your `GEMINI_API_KEY` is added to the Vercel Environment Variables settings.
