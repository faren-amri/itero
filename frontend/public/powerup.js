function completeTask(t) {
  return Promise.all([t.card('id'), t.member('id'), t.get('card', 'shared', 'taskCompleted')])
    .then(async ([card, member, alreadyDone]) => {
      const cardId = card.id;
      const memberId = member;

      if (!cardId || !memberId) {
        return t.alert({ message: '❌ Missing card or member info.' });
      }

      if (alreadyDone) {
        return t.alert({ message: '✅ Task already completed.' });
      }

      try {
        const response = await fetch('https://itero-api-fme7.onrender.com/api/tasks/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            trello_user_id: memberId,
            task_id: cardId
          }),
        });

        if (!response.ok) {
          return t.alert({ message: '❌ Task completion failed.' });
        }

        const data = await response.json();

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

      } catch (err) {
        console.error('[powerup.js] Task completion error:', err);
        return t.alert({
          message: '❌ Something went wrong.',
          duration: 4
        });
      }
    });
}

function openDashboard(t) {
  return t.member('id').then(memberId => {
    return t.modal({
      url: 'https://itero-powerup.netlify.app/#/dashboard',
      fullscreen: true,
      title: 'Motivation Dashboard',
      accentColor: '#4A90E2',
      args: {
        secret: 'itero-beta-2025',
        member: memberId
      }
    });
  });
}

window.TrelloPowerUp.initialize({
  'card-buttons': function () {
    return [{
      text: 'Complete Task 🎯',
      callback: completeTask
    }];
  },
  'board-buttons': function () {
    return [{
      icon: 'https://itero-powerup.netlify.app/assets/itero-icon-w-24.png',
      text: 'Itero',
      callback: openDashboard
    }];
  }
});
