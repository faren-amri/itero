
// Task Completion Handler
async function completeTask(t) {

  try {
    const context = await t.getContext();
    const cardId = context.card;
    const memberId = context.member;

    if (!cardId || !memberId) {
      t.alert({ message: "❌ Missing card or member info." });
      return;
    }

    // Prevent duplicate completions
    const alreadyDone = await t.get('card', 'shared', 'taskCompleted');
    if (alreadyDone) {
      t.alert({ message: '✅ Task already completed.' });
      return;
    }

    // Call your backend
    const response = await fetch('https://itero-api-fme7.onrender.com/api/tasks/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trello_user_id: memberId,
        task_id: cardId,
      }),
    });

    if (!response.ok) {
      throw new Error('API call failed');
    }

    const data = await response.json();
    const xp = data?.xp_gained ?? 10;
    const level = data?.level ?? '?';
    const streak = data?.streak_count ?? 0;

    // Store completion flag
    await t.set('card', 'shared', 'taskCompleted', true);

    // Signal dashboard to refresh on next open
    await t.set('member', 'shared', 'refresh', true);

    // Trello toast
    t.alert({
      message: `🎉 +${xp} XP · Level ${level} · 🔥 ${streak}-day streak`,
      duration: 4,
    });

  } catch (err) {
    console.error('[powerup.js] Task completion error:', err);
    t.alert({
      message: '❌ Failed to complete task.',
      duration: 4,
    });
  }
}

// Dashboard Modal Handler
function openDashboard(t) {
  console.log('[powerup.js] openDashboard called');
  return t.modal({
    url: 'https://itero-powerup.netlify.app/#/dashboard',
    fullscreen: true,
    title: 'Motivation Dashboard',
    accentColor: '#4A90E2',
    args: {
      member: t.getContext().member,
      secret: 'itero-beta-2025',
    }
  });
}

// Register Buttons
window.TrelloPowerUp.initialize({
  'board-buttons': function () {
    console.log('[powerup.js] board-buttons callback triggered');
    return [{
      icon: 'https://itero-powerup.netlify.app/icon.png',
      text: 'Open Itero',
      callback: openDashboard
    }];
  },
  'card-buttons': function () {
    return [{
      text: 'Complete Task 🎯',
      callback: completeTask
    }];
  }
});
