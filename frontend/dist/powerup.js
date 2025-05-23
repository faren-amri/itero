console.log('[powerup.js] Loaded and running');

function openDashboard(t) {
  console.log('[powerup.js] openDashboard called');
  const context = t.getContext(); 
  return t.modal({
    url: 'https://itero-powerup.netlify.app/#/dashboard',
    fullscreen: true,
    title: 'Motivation Dashboard',
    accentColor: '#4A90E2',
    args: {
      card: context.card,
      member: context.member,
      secret: 'itero-beta-2025'
    }
  });
}

function completeTask(t) {
  console.log('[powerup.js] completeTask called');
  const context = t.getContext(); 
  return t.modal({
    url: 'https://itero-powerup.netlify.app/#/dashboard',
    fullscreen: true,
    title: 'Complete Task',
    accentColor: '#4A90E2',
    args: {
      card: context.card,
      member: context.member,
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
    console.log('[powerup.js] card-buttons callback triggered');
    return [{
      text: 'Complete Task 🎯',
      callback: completeTask
    }];
  },
  'card-detail-badges': function () {
    return [];
  },
  'card-back-section': function () {
    return [];
  },
  'show-authorization': function () {
    return false;
  },
  'authorization-status': function () {
    return { authorized: true };
  }
});
