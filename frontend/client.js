const TrelloPowerUp = window.TrelloPowerUp;

TrelloPowerUp.initialize({
  'board-buttons': function (t, options) {
    return [{
      icon: 'https://itero-powerup.netlify.app/icon.png',
      text: 'Open Itero',
      callback: function (t) {
        return t.popup({
          title: 'Challenge Popup',
          url: 'https://itero-powerup.netlify.app/popup.html',
          height: 200
        });
      }
    }];
  }
});
