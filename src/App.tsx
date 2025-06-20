import React from 'react';
import './App.css';
import TarotCardWidget from './components/TarotCardWidget';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>My Tarot Widget Demo</h1>
      </header>
      <main style={{ padding: '2rem' }}>
        <TarotCardWidget />
      </main>
    </div>
  );
}

export default App;
