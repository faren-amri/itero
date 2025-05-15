const TrelloPowerUp = window.TrelloPowerUp;

TrelloPowerUp.initialize({
  'card-buttons': function (t) {
    return [{
      icon: 'https://itero-powerup.netlify.app/icon.png',
      text: 'Motivation Dashboard',
      callback: function (t) {
        return t.popup({
          title: 'Motivation Dashboard',
          url: 'index.html',
          height: 400
        });
      }
    }];
  }
});
