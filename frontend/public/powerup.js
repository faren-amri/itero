window.TrelloPowerUp.initialize({
  'card-buttons': function(t) {
    return [{
      text: 'Complete Task 🎯',
      callback: function(t) {
        return t.popup({
          title: "Motivation Dashboard",
          url: './index.html#/dashboard',  // ✅ Trello loads this SPA route
          height: 600
        });
      }
    }];
  }
});
