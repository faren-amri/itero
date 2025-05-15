window.TrelloPowerUp.initialize({
  'card-buttons': function (t) {
    return [{
      icon: 'https://itero-powerup.netlify.app/icon.png',
      text: 'Complete Task 🎯',
      callback: function (t) {
        return t.popup({
          title: "Motivation Dashboard",
          url: './index.html',  // Trello iframe loads your React app here
          height: 600
        });
      }
    }];
  }
});
