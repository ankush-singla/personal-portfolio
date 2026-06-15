import {StrictMode} from 'react'; // Build: 2026-04-20-0340
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import posthog from 'posthog-js';
import App from './App.tsx';
import WritingIndex from './pages/WritingIndex.tsx';
import PostPage from './pages/PostPage.tsx';
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<App />} />
            <Route path="/writing" element={<WritingIndex />} />
            <Route path="/writing/:slug" element={<PostPage />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
);
