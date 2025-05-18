console.log("🔍 Is inside Trello iframe?", window.location !== window.parent ? "✅ Yes" : "❌ No");

window.TrelloPowerUp.initialize({
  'board-buttons': function (t) {
    return [{
      icon: 'https://itero-powerup.netlify.app/icon.png',
      text: 'Open Itero',
      callback: function (t) {
        return t.popup({
          title: 'Launching Dashboard...',
          url: './dashboard-wrapper.html',
          height: 100  // Slightly taller to give buffer for iframe load
        });
      }
    }];
  },

  'card-buttons': function (t) {
    return [{
      text: 'Complete Task 🎯',
      callback: function (t) {
        return t.popup({
          title: 'Completing Task...',
          url: './dashboard-wrapper.html',
          height: 100
        });
      }
    }];
  }
});
