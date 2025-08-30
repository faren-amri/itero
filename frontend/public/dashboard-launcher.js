// public/dashboard-launcher.js
(async function () {
  const t = window.TrelloPowerUp.iframe();

  // Build a guaranteed hashless URL
  const base = new URL('https://itero-powerup.netlify.app/index.html');
  base.hash = ''; // defensive
  const clean = base.toString().split('#')[0]; // double-defensive

  // Sign clean URL, then append hash AFTER signing
  const signed = await t.signUrl(clean);
  const url = `${signed}#/dashboard`;

  await t.modal({
    url,
    title: 'Itero Dashboard',
    fullscreen: true
  });

  t.closePopup();
})();
