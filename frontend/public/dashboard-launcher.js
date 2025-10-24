// public/dashboard-launcher.js
(function () {
  // If opened outside Trello (directly in a browser), just go to the app.
  if (!window.TrelloPowerUp) {
    window.location.replace('/index.html#/dashboard'); // or '/index.html?goto=dashboard'
    return;
  }

  const t = window.TrelloPowerUp.iframe();

  // Root-relative, no domain
  const url = '/index.html#/dashboard'; // or '/index.html?goto=dashboard' if you use query routing

  t.modal({
    url,
    title: 'Itero Dashboard',
    fullscreen: true
  })
  .then(() => t.closePopup())
  .catch(() => t.closePopup());
})();
