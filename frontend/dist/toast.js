// frontend/public/toast.js
(function () {
  const t = window.TrelloPowerUp && window.TrelloPowerUp.iframe
    ? window.TrelloPowerUp.iframe()
    : null;

  const $ = (sel) => document.querySelector(sel);

  const titleEl = $('.itero-title');
  const subEl   = $('.itero-sub');
  const pillbar = $('#pillbar');
  const pillSection = $('#pill-section');

  if (!titleEl || !subEl || !pillbar || !pillSection) {
    console.warn('[toast] Required DOM missing');
    return;
  }

  const q = new URLSearchParams(location.search);
  const xp     = Number(q.get('xp') || 0);
  const level  = q.get('level') || '?';
  const streak = Number(q.get('streak') || 0);
  const done   = Number(q.get('done') || 0);
  const note   = q.get('note') || '';

  if (note === 'already') {
    titleEl.textContent = 'Already Completed';
    subEl.textContent = 'This task was previously marked done.';
    pillSection.style.display = 'none';
  } else {
    const pills = [
      { emoji: '🎉', label: 'XP',     value: `+${xp}` },
      { emoji: '🏅', label: 'Level',  value: `${level}` },
      { emoji: '🔥', label: 'Streak', value: `${streak}-day` },
    ];
    if (done > 0) pills.push({ emoji: '🏆', label: 'Challenges', value: `${done} completed` });

    pills.forEach(p => {
      const el = document.createElement('div');
      el.className = 'itero-pill';
      el.innerHTML = `${p.emoji} ${p.label}: <b>${p.value}</b>`;
      pillbar.appendChild(el);
    });
  }

  $('#openDash')?.addEventListener('click', async () => {
    try {
      if (t) {
        // branch-safe: no leading slash
        await t.modal({
          url: 'index.html#/dashboard',
          title: 'Itero Dashboard',
          height: 620,
          fullscreen: false
        });
      } else {
        // Fallback open in same tab if somehow outside Trello
        location.href = 'index.html#/dashboard';
      }
    } finally {
      t && t.closePopup();
    }
  });

  $('#closeBtn')?.addEventListener('click', () => t && t.closePopup());
  window.addEventListener('keydown', (e) => e.key === 'Escape' && t && t.closePopup());
  setTimeout(() => t && t.closePopup(), 4500);
})();
