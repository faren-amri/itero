// powerup.js

async function completeTask(t) {
  const [card, member, alreadyDone] = await Promise.all([
    t.card('id'),
    t.member('id'),
    t.get('card', 'shared', 'taskCompleted'),
  ]);

  const cardId = card?.id;
  const memberId = member?.id;

  if (!cardId || !memberId) return t.alert({ message: '❌ Missing card or member info.' });
  if (alreadyDone) return t.alert({ message: '✅ Task already completed.' });

  try {
    const resp = await fetch('https://itero-api-fme7.onrender.com/api/tasks/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trello_user_id: memberId, task_id: cardId }),
    });

    if (!resp.ok) return t.alert({ message: '❌ Task completion failed.' });

    const data = await resp.json();

    await t.set('card', 'shared', 'taskCompleted', true);
    await t.set('member', 'shared', 'refresh', true);

    const xp = data?.xp_gained ?? 10;
    const lvl = data?.level ?? '?';
    const streak = data?.streak_count ?? 0;
    const completed = data?.completed_challenges?.length ?? 0;

    let message = `🎉 +${xp} XP · Level ${lvl} · 🔥 ${streak}-day streak`;
    if (completed > 0) message += ` · 🏆 ${completed} challenge${completed > 1 ? 's' : ''} completed`;

    return t.alert({ message, duration: 5 });
  } catch (_) {
    // no console logs in production
    return t.alert({ message: '❌ Something went wrong.', duration: 4 });
  }
}

async function openDashboard(t) {
  // Pre-sign the base URL, then append hash to avoid the "signing url that already has a hash" warning
  const signed = await t.signUrl('https://itero-powerup.netlify.app/index.html');
  return t.modal({
    url: `${signed}#/dashboard`,
    fullscreen: true,
    title: 'Motivation Dashboard',
    accentColor: '#4A90E2',
    args: { member: (await t.member('id'))?.id || null },
  });
}

function openSettings(t) {
  return t.popup({
    title: 'Itero Settings',
    url: 'https://itero-powerup.netlify.app/terms-of-service.html', // simple, static, zero-console
    height: 240,
  });
}

window.TrelloPowerUp.initialize({
  'card-buttons': () => [{
    text: 'Complete Task 🎯',
    callback: completeTask,
  }],
  'board-buttons': () => [{
    icon: 'https://itero-powerup.netlify.app/assets/itero-icon-w-24.png',
    text: 'Itero',
    callback: openDashboard,
  }],
  // Only declare capabilities you actually handle:
  'show-settings': openSettings,
});
