console.log('[powerup.js] Loaded and running');

// ✅ Define functions BEFORE initialize()
function openDashboard(t) {
  console.log('[powerup.js] openDashboard called');
  return t.signUrl('https://itero-powerup.netlify.app/#/dashboard')
    .then((signedUrl) => {
      return t.modal({
        url: signedUrl,
        fullscreen: true,
        title: 'Motivation Dashboard',
        accentColor: '#4A90E2'
      });
    });
}

function completeTask(t) {
  console.log('[powerup.js] completeTask called');
  return t.signUrl('https://itero-powerup.netlify.app/#/dashboard')
    .then((signedUrl) => {
      return t.modal({
        url: signedUrl,
        fullscreen: true,
        title: 'Complete Task',
        accentColor: '#4A90E2'
      });
    });
}

window.TrelloPowerUp.initialize({
  'board-buttons': function () {
    console.log('[powerup.js] board-buttons callback triggered');
    return [{
      icon: 'https://itero-powerup.netlify.app/icon.png',
      text: 'Open Itero',
      callback: openDashboard   // ✅ Now correctly in scope
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
