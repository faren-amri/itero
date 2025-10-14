// public/dashboard-launcher.js
(async function () {
  const t = window.TrelloPowerUp.iframe();

  // No hash here; Trello will sign this internally.
  const url = 'https://ui-redesign--itero-powerup.netlify.app/index.html?goto=dashboard';

  await t.modal({
    url,
    title: 'Itero Dashboard',
    fullscreen: true
  });

  t.closePopup();
})();
