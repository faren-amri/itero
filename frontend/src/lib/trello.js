// src/lib/trello.js
export const trello =
  (window?.TrelloPowerUp && typeof window.TrelloPowerUp.iframe === 'function')
    ? window.TrelloPowerUp.iframe()
    : null;
export default trello;
