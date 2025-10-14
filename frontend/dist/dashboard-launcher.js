(async function () {
  const t = window.TrelloPowerUp.iframe();
  const [card, member] = await Promise.all([t.card('id'), t.member('id')]);

  const url = `https://ui-redesign--itero-powerup.netlify.app/index.html#/dashboard` +
              `?member=${encodeURIComponent(member?.id || '')}` +
              `&card=${encodeURIComponent(card?.id || '')}`;

  const signedUrl = await t.signUrl(url);

  await t.modal({ url: signedUrl, title: 'Itero Dashboard', fullscreen: true });
  t.closePopup();
})();
