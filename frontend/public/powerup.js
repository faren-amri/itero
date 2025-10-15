/* global TrelloPowerUp */

const tpu = window.TrelloPowerUp;

// Static assets hosted on your domain
const ICON_URL = '/assets/itero-icon-w-24.png';

// TEMP: public/ is not bundled, so no imports. Hardcode dev API for this branch.
const API_BASE = 'https://itero-api-dev-zg94.onrender.com';

// --- Actions ---

async function openDashboardFromButton(t) {
  return t.popup({
    title: 'Itero',
    url: '/dashboard-wrapper.html',  // root-relative
    height: 80
  });
}

async function completeTask(t) {
  const [card, member] = await Promise.all([t.card('id'), t.member('id')]);
  const cardId = card && card.id;
  const memberId = member && member.id;

  if (!cardId || !memberId) {
    return t.alert({ message: '❌ Missing card or member context.' });
  }

  const alreadyDone = await t.get('card', 'shared', 'taskCompleted');
  if (alreadyDone) {
    return t.alert({ message: '✅ Task already completed.' });
  }

  try {
    const res = await fetch(`${API_BASE}/api/tasks/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trello_user_id: memberId, task_id: cardId })
    });

    if (!res.ok) return t.alert({ message: '❌ Task completion failed.' });

    const data = await res.json();

    await t.set('card', 'shared', 'taskCompleted', true);
    await t.set('member', 'shared', 'refresh', true);

    const xp     = data?.xp_gained ?? 10;
    const level  = data?.level ?? '?';
    const streak = data?.streak_count ?? 0;
    const done   = Array.isArray(data?.completed_challenges) ? data.completed_challenges.length : 0;

    let msg = `🎉 +${xp} XP · Level ${level} · 🔥 ${streak}-day streak`;
    if (done > 0) msg += ` · 🏆 ${done} challenge${done > 1 ? 's' : ''} completed`;

    return t.alert({ message: msg, duration: 5 });
  } catch {
    return t.alert({ message: '❌ Something went wrong.', duration: 4 });
  }
}

function openSettings(t) {
  return t.popup({
    title: 'Itero Settings',
    url: 'settings.html',
    height: 240
  });
}

tpu.initialize({
  'board-buttons': () => [
    { icon: ICON_URL, text: 'Itero', callback: openDashboardFromButton }
  ],

  'card-buttons': () => [
    { icon: ICON_URL, text: 'Complete Task 🎯', callback: completeTask },
    { icon: ICON_URL, text: 'Open Itero',        callback: openDashboardFromButton }
  ],

  // Comment this out if you don't ship settings.html:
  'show-settings': openSettings
});
