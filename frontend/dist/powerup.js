window.TrelloPowerUp.initialize({

  'board-buttons': function (t, opts) {
    return [{
      icon: 'https://itero-powerup.netlify.app/icon.png',
      text: 'Open Itero',
      callback: function (t) {
        return t.modal({
          url: './index.html#/dashboard',
          accentColor: '#0079BF',
          height: 600,
          fullscreen: false,
          title: "Itero Motivation Dashboard"
        });
      }
    }];
  },

  'card-buttons': function (t, opts) {
    return [{
      text: 'Complete Task 🎯',
      callback: function (t) {
        return t.popup({
          title: "Complete Task",
          url: './index.html#/dashboard',
          height: 600
        });
      }
    }];
  }

});
