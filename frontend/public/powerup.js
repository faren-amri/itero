window.TrelloPowerUp.initialize({
  'board-buttons': function (t) {
    return [{
      icon: 'https://itero-powerup.netlify.app/icon.png',
      text: 'Open Itero',
      callback: function (t) {
        return t.modal({
          url: 'https://itero-powerup.netlify.app/#/dashboard',
          fullscreen: true,
          title: 'Motivation Dashboard',
          accentColor: '#4A90E2',
          args: {
            secret: 'itero-beta-2025',
            member: t.getContext().member,
            card: t.getContext().card
          }
        });
      }
    }];
  },

  'card-buttons': function (t) {
    return [{
      text: 'Complete Task 🎯',
      callback: function (t) {
        return t.modal({
          url: 'https://itero-powerup.netlify.app/#/dashboard',
          fullscreen: true,
          title: 'Complete Task',
          accentColor: '#4A90E2',
          args: {
            secret: 'itero-beta-2025',
            member: t.getContext().member,
            card: t.getContext().card
          }
        });
      }
    }];
  }
});
