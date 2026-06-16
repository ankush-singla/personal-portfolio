import {StrictMode} from 'react'; // Build: 2026-04-20-0340
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import posthog from 'posthog-js';
import App from './App.tsx';
import WritingIndex from './pages/WritingIndex.tsx';
import PostPage from './pages/PostPage.tsx';
import BuildPage from './pages/BuildPage.tsx';
import Layout from './components/Layout.tsx';
import { AppProvider } from './context/AppContext.tsx';
import './index.css';

const phKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;

if (phKey) {
  posthog.init(phKey, {
    api_host: '/api/chat',
    person_profiles: 'always',
    capture_pageview: true,
    autocapture: true,
    session_recording: {
      maskAllInputs: false,
      maskInputOptions: { password: true }
    },
    loaded: (ph) => {
      if (import.meta.env.DEV) ph.debug();
    }
  });
}

// Take scroll into our own hands. With the browser's default 'auto' restoration,
// hitting Back to return home re-applies the saved scroll position (e.g. the
// Career Overview / Samsung area) *after* our scroll-to-top runs, so it wins and
// you land mid-page. 'manual' lets each route's own scroll logic decide instead.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Static prerendered content (injected at build time for crawlers / readers like
// ElevenLabs that don't run JS) lives in #prerender-seo. Once the real app is
// taking over, drop it so human visitors never see the duplicate.
document.getElementById('prerender-seo')?.remove();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<App />} />
            <Route path="/writing" element={<WritingIndex />} />
            <Route path="/writing/:slug" element={<PostPage />} />
            <Route path="/build" element={<BuildPage />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
);
