/* global TrelloPowerUp */

// ---- Actions ----

async function completeTask(t) {
  const [card, member, alreadyDone] = await Promise.all([
    t.card('id'),
    t.member('id'),
    t.get('card', 'shared', 'taskCompleted'),
  ]);

  const cardId = card?.id;
  const memberId = member?.id;

  if (!cardId || !memberId) {
    return t.alert({ message: '❌ Missing card or member info.' });
  }
  if (alreadyDone) {
    return t.alert({ message: '✅ Task already completed.' });
  }

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
    if (completed > 0) {
      message += ` · 🏆 ${completed} challenge${completed > 1 ? 's' : ''} completed`;
    }

    return t.alert({ message, duration: 5 });
  } catch {
    return t.alert({ message: '❌ Something went wrong.', duration: 4 });
  }
}

async function openDashboard(t) {
  // Sign the BASE file only; append the hash AFTER signing.
  const baseUrl = 'https://itero-powerup.netlify.app/index.html';
  const signedBase = await t.signUrl(baseUrl);

  return t.modal({
    url: `${signedBase}#/dashboard`,
    title: 'Motivation Dashboard',
    fullscreen: true,
    accentColor: '#4A90E2',
    // Pass Trello member ID into React app
    args: { member: (await t.member('id'))?.id || null },
  });
}

function openSettings(t) {
  return t.popup({
    title: 'Itero Settings',
    url: 'https://itero-powerup.netlify.app/settings.html', // simple static page
    height: 240,
  });
}

// ---- Connector initialization ----

window.TrelloPowerUp.initialize({
  // Keep capabilities minimal — only ones you actually implement
  'board-buttons': (t) => [
    {
      icon: 'https://itero-powerup.netlify.app/assets/itero-icon-w-24.png',
      text: 'Itero',
      callback: openDashboard,
    },
  ],

  'card-buttons': (t) => [
    {
      text: 'Complete Task 🎯',
      callback: completeTask,
    },
  ],

  'show-settings': openSettings,
});
