// frontend/public/toast.js
(function () {
  const t = window.TrelloPowerUp?.iframe();
  const q = new URLSearchParams(location.search);

  const xp = Number(q.get('xp') || 0);
  const level = q.get('level') || '?';
  const streak = Number(q.get('streak') || 0);
  const done = Number(q.get('done') || 0);
  const note = q.get('note') || '';

  const titleEl = document.querySelector('.itero-title');
  const subEl = document.querySelector('.itero-sub');
  const pillSection = document.getElementById('pill-section');
  const pillbar = document.getElementById('pillbar');

  if (note === 'already') {
    titleEl.textContent = 'Already Completed';
    subEl.textContent = 'This task was previously marked done.';
    pillSection.style.display = 'none';
  } else {
    const pills = [
      { emoji: '🎉', label: 'XP', value: `+${xp}` },
      { emoji: '🏅', label: 'Level', value: `${level}` },
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

  document.getElementById('openDash').addEventListener('click', async () => {
    try {
      await t.modal({
        url: '/index.html#/dashboard',
        title: 'Itero Dashboard',
        height: 620,
        fullscreen: false,
        accentColor: getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#2f6aa6'
      });
    } finally {
      t.closePopup();
    }
  });

  document.getElementById('closeBtn').addEventListener('click', () => t.closePopup());
  window.addEventListener('keydown', (e) => e.key === 'Escape' && t.closePopup());
  setTimeout(() => t.closePopup(), 4500);
})();
