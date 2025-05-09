const TrelloPowerUp = window.TrelloPowerUp;

TrelloPowerUp.initialize({
  'board-buttons': function (t, options) {
    return [{
      icon: 'https://itero-powerup.netlify.app/icon.png', // absolute URL
      text: 'Open Itero',
      callback: function (t) {
        return t.popup({
          title: 'Complete Challenge',
          url: 'https://itero-powerup.netlify.app/popup.html', // absolute URL
          height: 200
        });
      }
    }];
  }
});
