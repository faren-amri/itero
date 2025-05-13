window.TrelloPowerUp.initialize({
    'board-buttons': function (t) {
      return [{
        icon: './icon.png',
        text: 'Motivation Dashboard',
        callback: function (t) {
          return t.popup({
            title: 'Motivation Dashboard',
            url: 'https://itero-powerup.netlify.app/#/dashboard',
            height: 600
          });
        }
      }];
    }
  });
  