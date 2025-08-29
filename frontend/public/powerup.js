/* global TrelloPowerUp */

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
  } catch {
    return t.alert({ message: '❌ Something went wrong.', duration: 4 });
  }
}

async function openDashboard(t) {
  const baseUrl = 'https://itero-powerup.netlify.app/index.html'; // base only
  const signedBase = await t.signUrl(baseUrl);                     // sign base only
  return t.modal({
    url: `${signedBase}#/dashboard`,                               // append hash AFTER signing
    title: 'Motivation Dashboard',
    fullscreen: true,
    accentColor: '#4A90E2',
    args: { member: (await t.member('id'))?.id || null },
  });
}

function openSettings(t) {
  return t.popup({ title: 'Itero Settings', url: '/settings.html', height: 240 });
}

window.TrelloPowerUp.initialize({
  'board-buttons': () => [{ icon: '/assets/itero-icon-w-24.png', text: 'Itero', callback: openDashboard }],
  'card-buttons':  () => [{ text: 'Complete Task 🎯', callback: completeTask }],
  'show-settings': openSettings,
});
