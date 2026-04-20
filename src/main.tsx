import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import posthog from 'posthog-js';
import App from './App.tsx';
import './index.css';

const phKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;

if (phKey) {
  posthog.init(phKey, {
    api_host: `${window.location.origin}/api/metrics`,
    person_profiles: 'always',
    capture_pageview: true,
    loaded: (ph) => {
      if (import.meta.env.DEV) ph.debug();
    }
  });
} else {
  console.warn('PostHog Key missing. Analytics disabled.');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
