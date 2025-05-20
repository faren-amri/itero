console.log('[powerup.js] Loaded and running');

window.openDashboard = async function (t) {
  const context = await t.getContext();
  const signedUrl = await t.signUrl('https://itero-powerup.netlify.app/#/dashboard');
  return t.modal({
    url: signedUrl,
    fullscreen: true,
    title: 'Motivation Dashboard',
    accentColor: '#4A90E2',
    args: {
      secret: 'itero-beta-2025',
      member: context.member,
      card: context.card
    }
  });
};

window.completeTask = async function (t) {
  const context = await t.getContext();
  const signedUrl = await t.signUrl('https://itero-powerup.netlify.app/#/dashboard');
  return t.modal({
    url: signedUrl,
    fullscreen: true,
    title: 'Complete Task',
    accentColor: '#4A90E2',
    args: {
      secret: 'itero-beta-2025',
      member: context.member,
      card: context.card
    }
  });
};

window.TrelloPowerUp.initialize({
  'board-buttons': function () {
    console.log('[powerup.js] board-buttons callback triggered');
    return [{
      icon: 'https://itero-powerup.netlify.app/icon.png',
      text: 'Open Itero',
      callback: 'openDashboard' // ✅ matches manifest
    }];
  },
  'card-buttons': function () {
    return [{
      text: 'Complete Task 🎯',
      callback: 'completeTask'
    }];
  }
});
