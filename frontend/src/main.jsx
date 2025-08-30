// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { HashRouter } from 'react-router-dom';

// Convert query param to hash route so t.modal can pass a hashless URL
(() => {
  const params = new URLSearchParams(window.location.search);
  const goto = params.get('goto');
  if (goto && !window.location.hash) {
    // preserve current path; only set hash
    const { pathname, search } = window.location;
    const newUrl = `${pathname}${search ? '' : ''}#/${goto}`;
    window.location.replace(newUrl);
  }
})();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
