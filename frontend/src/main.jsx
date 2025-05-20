import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { HashRouter } from 'react-router-dom';

// ✅ Required for Trello iframe context to work
if (window.TrelloPowerUp) {
  window.TrelloPowerUp.iframe({
    appName: 'Itero Motivation Engine'
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
