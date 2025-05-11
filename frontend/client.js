const TrelloPowerUp = window.TrelloPowerUp;

TrelloPowerUp.initialize({
  'board-buttons': function (t) {
    return [{
      icon: 'https://itero-powerup.netlify.app/icon.png',
      text: 'Open Itero',
      callback: function (t) {
        return t.popup({
          title: 'Hello from Itero!',
          url: 'popup.html',
          height: 150
        });
      }
    }];
  }
});
