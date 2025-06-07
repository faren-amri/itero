async function completeTask(t) {
  console.log('[powerup.js] completeTask called');

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

    // Call backend API
    const response = await fetch('https://itero-api-fme7.onrender.com/api/tasks/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trello_user_id: memberId,
        task_id: cardId
      }),
    });

    if (!response.ok) {
      throw new Error('API call failed');
    }

    const data = await response.json();

    // Extract data
    const xp = data?.xp_gained ?? 10;
    const level = data?.level ?? '?';
    const streak = data?.streak_count ?? 0;
    const completed = data?.completed_challenges?.length ?? 0;

    // Save completion flag and refresh trigger
    await t.set('card', 'shared', 'taskCompleted', true);
    await t.set('member', 'shared', 'refresh', true);

    // Build toast message
    let message = `🎉 +${xp} XP · Level ${level} · 🔥 ${streak}-day streak`;
    if (completed > 0) {
      message += ` · 🏆 ${completed} challenge${completed > 1 ? 's' : ''} completed!`;
    }

    t.alert({
      message,
      duration: 5
    });

  } catch (err) {
    console.error('[powerup.js] Task completion error:', err);
    t.alert({
      message: '❌ Failed to complete task.',
      duration: 4
    });
  }
}
