console.log("🔍 Is inside Trello iframe?", window.location !== window.parent ? "✅ Yes" : "❌ No");

window.TrelloPowerUp.initialize({
  'board-buttons': function (t) {
    return [{
      icon: 'https://itero-powerup.netlify.app/icon.png',
      text: 'Open Itero',
      callback: function (t) {
        return t.popup({
          title: 'Open Itero',
          url: './dashboard-wrapper.html',
          height: 40
        });
      }
    }];
  },
  'card-buttons': function (t) {
    return [{
      text: 'Complete Task 🎯',
      callback: function (t) {
        return t.popup({
          title: 'Complete Task',
          url: './dashboard-wrapper.html',
          height: 40
        });
      }
    }];
  }
});
