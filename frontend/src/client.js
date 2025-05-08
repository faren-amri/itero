const TrelloPowerUp = window.TrelloPowerUp;

TrelloPowerUp.initialize({
  'board-buttons': function (t, options) {
    return [{
      icon: '/public/icon.png',
      text: 'Open Itero',
      callback: function (t) {
        return t.popup({
          title: 'Complete Challenge',
          url: '/public/popup.html',
          height: 200
        });
      }
    }];
  }
});
