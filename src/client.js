const TrelloPowerUp = window.TrelloPowerUp;
const t = TrelloPowerUp.initialize({
  'board-buttons': function (t, options) {
    return [{
      icon: '/public/icon.png',
      text: 'Open Itero',
      callback: function (t) {
        return t.popup({
          title: 'Itero Motivation Engine',
          url: '/public/popup.html',
          height: 200
        });
      }
    }];
  }
});
