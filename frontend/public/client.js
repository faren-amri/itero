const TrelloPowerUp = window.TrelloPowerUp;

TrelloPowerUp.initialize({
  'board-buttons': function (t) {
    return [{
      icon: 'https://itero-powerup.netlify.app/icon.png',
      text: 'Open Itero',
      callback: function (t) {
        return fetch('https://itero-api-fme7.onrender.com/api/complete-challenge', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            trelloUser: "test-user-id",
            challengeId: 1
          })
        })
        .then(res => res.json())
        .then(data => {
          alert("✅ Challenge complete! XP earned: " + data.xp);
        })
        .catch(err => {
          alert("❌ Failed to log challenge.");
          console.error(err);
        });
      }
    }];
  }
});
