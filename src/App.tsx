// src/App.tsx
import React from 'react';
import './App.css';
import TarotCardWidget from './components/TarotCardWidget';

function App() {
  // Point directly at your deployed Netlify function
  const subscribeEndpoint = 
    'https://tarot-widget.netlify.app/.netlify/functions/subscribe';

  return (
    <div className="App">
      <header className="App-header">
        <h1>My Tarot Widget Demo</h1>
      </header>
      <main style={{ padding: '2rem' }}>
        <TarotCardWidget subscribeEndpoint={subscribeEndpoint} />
      </main>
    </div>
  );
}

export default App;
