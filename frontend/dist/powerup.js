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
