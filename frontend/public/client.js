const TrelloPowerUp = window.TrelloPowerUp;

TrelloPowerUp.initialize({
  'card-buttons': function (t) {
    return [{
      icon: 'https://itero-powerup.netlify.app/icon.png',
      text: 'Complete Task 🎯',
      callback: function (t) {
        return t.card('id')
          .then(function (card) {
            return t.member('id', 'fullName', 'username')
              .then(function (member) {
                return fetch('https://itero-api-fme7.onrender.com/api/tasks/complete', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    trello_user_id: member.id,
                    trello_username: member.username,
                    task_id: card.id
                  })
                });
              });
          })
          .then(res => res.json())
          .then(data => {
            alert("✅ Task complete!\nXP: " + data.xp + " | Streak: " + data.streak_count);
          })
          .catch(err => {
            console.error("❌ Error:", err);
            alert("❌ Failed to complete task.");
          });
      }
    }];
  }
});
