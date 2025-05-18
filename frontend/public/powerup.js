window.TrelloPowerUp.initialize({
  'board-buttons': function (t) {
    return [{
      icon: 'https://itero-powerup.netlify.app/icon.png',
      text: 'Open Itero',
      callback: function (t) {
        return t.popup({
          title: 'Open Itero',
          url: './dashboard-wrapper.html', // ✅ new wrapper page
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
          url: './dashboard-wrapper.html', // ✅ same wrapper
          height: 40
        });
      }
    }];
  }
});
