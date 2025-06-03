console.log('[powerup.js] Loaded and running');

function completeTask(t) {
  console.log('[powerup.js] completeTask called');
  return t.modal({
    url: 'https://itero-powerup.netlify.app/#/task-complete',
    fullscreen: false,
    height: 200,
    title: 'Task Completed!',
    accentColor: '#4A90E2',
    args: {
      cardId: t.getContext().card,
      memberId: t.getContext().member,
      secret: 'itero-beta-2025'
    }
  });
}

function openDashboard(t) {
  console.log('[powerup.js] openDashboard called');
  return t.modal({
    url: 'https://itero-powerup.netlify.app/#/dashboard',
    fullscreen: true,
    title: 'Motivation Dashboard',
    accentColor: '#4A90E2',
    args: {
      member: t.getContext().member,
      secret: 'itero-beta-2025'
    }
  });
}

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
