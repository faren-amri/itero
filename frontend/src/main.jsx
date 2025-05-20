import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { HashRouter } from 'react-router-dom';

const APP_KEY = '0f004da5af110390ba7fe702b6c995cb';

if (window.TrelloPowerUp) {
  window.TrelloPowerUp.iframe({
    appKey: APP_KEY,
    appName: 'Itero Motivation Engine'
  });

  window.TrelloPowerUp.initialize({}); // ✅ THIS IS MANDATORY!
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
