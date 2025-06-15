const TrelloPowerUp = window.TrelloPowerUp;

TrelloPowerUp.initialize({
  'card-buttons': function (t) {
    return [{
      icon: 'https://itero-powerup.netlify.app/assets/itero-icon-144.png',
      text: 'Motivation Dashboard',
      callback: function (t) {
        return t.popup({
          title: 'Motivation Dashboard',
          url: '/popup.html', 
          height: 400
        });
      }
    }];
  }
});
