console.log('[powerup.js] Loaded and running');

// ✅ These functions must be defined before being used as callbacks
function openDashboard(t) {
  console.log('[powerup.js] openDashboard called');
  return t.modal({
    url: 'https://itero-powerup.netlify.app/#/dashboard',
    fullscreen: true,
    title: 'Motivation Dashboard',
    accentColor: '#4A90E2'
  });
}

function completeTask(t) {
  console.log('[powerup.js] completeTask called');
  return t.modal({
    url: 'https://itero-powerup.netlify.app/#/dashboard',
    fullscreen: true,
    title: 'Complete Task',
    accentColor: '#4A90E2'
  });
}

// ✅ Declare Trello Power-Up capabilities
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
  // Optional capabilities (NOOP handlers to prevent retain crash)
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
