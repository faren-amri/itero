window.TrelloPowerUp.initialize({
  'board-buttons': function (t) {
    return [{
      icon: 'https://itero-powerup.netlify.app/icon.png',
      text: 'Open Itero',
      callback: function (t) {
        return t.modal({
          url: './index.html#/dashboard',
          fullscreen: true,
          title: 'Motivation Dashboard',
          accentColor: '#4A90E2'
        });
      }
    }];
  },

  'card-buttons': function (t) {
    return [{
      text: 'Complete Task 🎯',
      callback: function (t) {
        return t.modal({
          url: './index.html#/dashboard',
          fullscreen: true,
          title: 'Complete Task',
          accentColor: '#4A90E2'
        });
      }
    }];
  }
});
