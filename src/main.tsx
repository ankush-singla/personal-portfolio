import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import posthog from 'posthog-js';
import App from './App.tsx';
import './index.css';

const phKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;

if (phKey) {
  console.log('PostHog: Initializing with key...', phKey.substring(0, 8) + '...');
  posthog.init(phKey, {
    api_host: '/api/chat',
    person_profiles: 'always',
    capture_pageview: true,
    loaded: (ph) => {
      console.log('PostHog: Library loaded successfully');
      if (import.meta.env.DEV) ph.debug();
    }
  });
} else {
  console.error('PostHog: API Key missing from environment variables!');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
