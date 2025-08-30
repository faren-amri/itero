import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { HashRouter } from 'react-router-dom';

// ✅ Guarded Trello iframe export (safe to import anywhere)
export const trello =
  (window?.TrelloPowerUp && window.TrelloPowerUp.iframe)
    ? window.TrelloPowerUp.iframe()
    : null;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
