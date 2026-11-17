import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Scaffold placeholder for T01 (docs/ARCHITECTURE.md §14).
// The router, providers, and application shell are introduced by T07.
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root is missing from index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <main>
      <h1>Cricket Manager</h1>
      <p>Scaffold placeholder — screens arrive in later tasks.</p>
    </main>
  </StrictMode>,
);
