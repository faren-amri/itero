/* global TrelloPowerUp */

const tpu = window.TrelloPowerUp;

// Static assets hosted on your domain
const ICON_URL = 'https://itero-powerup.netlify.app/assets/itero-icon-w-24.png';

// --- Actions ---

async function openDashboardFromButton(t) {
  // Use a small popup that immediately opens the full-screen modal and closes
  return t.popup({
    title: 'Itero',
    url: 'dashboard-wrapper.html', // RELATIVE to /public
    height: 80
  });
}

async function completeTask(t) {
  // Read Trello context
  const [card, member] = await Promise.all([t.card('id'), t.member('id')]);
  const cardId = card && card.id;
  const memberId = member && member.id;

  if (!cardId || !memberId) {
    return t.alert({ message: '❌ Missing card or member context.' });
  }

  // Prevent double-submission based on card shared state
  const alreadyDone = await t.get('card', 'shared', 'taskCompleted');
  if (alreadyDone) {
    return t.alert({ message: '✅ Task already completed.' });
  }

  try {
    // IMPORTANT: send only the raw id string (not an object)
    const res = await fetch('https://itero-api-fme7.onrender.com/api/tasks/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trello_user_id: memberId,
        task_id: cardId
      })
    });

    if (!res.ok) {
      return t.alert({ message: '❌ Task completion failed.' });
    }

    const data = await res.json();

    // Mark completed in Trello shared state
    await t.set('card', 'shared', 'taskCompleted', true);
    await t.set('member', 'shared', 'refresh', true);

    // Toast UX
    const xp     = data?.xp_gained ?? 10;
    const level  = data?.level ?? '?';
    const streak = data?.streak_count ?? 0;
    const done   = Array.isArray(data?.completed_challenges) ? data.completed_challenges.length : 0;

    let msg = `🎉 +${xp} XP · Level ${level} · 🔥 ${streak}-day streak`;
    if (done > 0) msg += ` · 🏆 ${done} challenge${done > 1 ? 's' : ''} completed`;

    return t.alert({ message: msg, duration: 5 });
  } catch (e) {
    return t.alert({ message: '❌ Something went wrong.', duration: 4 });
  }
}

function openSettings(t) {
  // Only keep this if you ship settings.html; otherwise remove the capability below
  return t.popup({
    title: 'Itero Settings',
    url: 'settings.html',
    height: 240
  });
}

// --- Register capabilities ---

tpu.initialize({
  'board-buttons': function () {
    return [
      {
        icon: ICON_URL,
        text: 'Itero',
        callback: openDashboardFromButton
      }
    ];
  },

  'card-buttons': function () {
    return [
      {
        icon: ICON_URL,
        text: 'Complete Task 🎯',
        callback: completeTask
      },
      {
        icon: ICON_URL,
        text: 'Open Itero',
        callback: openDashboardFromButton
      }
    ];
  },

  // Remove this key if you do not include settings.html
  'show-settings': openSettings
});
