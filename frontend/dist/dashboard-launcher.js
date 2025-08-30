// public/dashboard-launcher.js
(async function () {
  const t = window.TrelloPowerUp.iframe();

  // Sign the base file WITHOUT a hash
  const signed = await t.signUrl('https://itero-powerup.netlify.app/index.html');

  // Append the hash AFTER signing to avoid Trello warnings
  const url = `${signed}#/dashboard`;

  await t.modal({
    url,
    title: 'Itero Dashboard',
    fullscreen: true
  });

  t.closePopup();
})();
