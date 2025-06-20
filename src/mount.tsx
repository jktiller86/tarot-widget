// src/mount.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import TarotCardWidget from './components/TarotCardWidget';

export interface MountOptions {
  subscribeEndpoint: string;
}

function mountTarotWidget(
  containerSelector: string,
  options: MountOptions
) {
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.error('TarotWidget: container not found', containerSelector);
    return;
  }

  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <TarotCardWidget subscribeEndpoint={options.subscribeEndpoint} />
    </React.StrictMode>
  );
}

;(window as any).mountTarotWidget = mountTarotWidget;