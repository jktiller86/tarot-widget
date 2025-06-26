// src/mount.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import TarotCardWidget from './components/TarotCardWidget';

type InitOptions = {
  root: string;              // CSS selector for mount point
  subscribeEndpoint: string; // your Netlify function URL
};

export function init(options: InitOptions) {
  const el = document.querySelector(options.root);
  if (!el) {
    console.warn('[TarotCardWidget] root element not found:', options.root);
    return;
  }
  const root = createRoot(el as HTMLElement);
  root.render(<TarotCardWidget subscribeEndpoint={options.subscribeEndpoint} />);
}

// expose to window
;(window as any).TarotCardWidget = { init };
