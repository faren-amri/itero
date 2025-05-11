const TrelloPowerUp = window.TrelloPowerUp;

TrelloPowerUp.initialize({
  'card-buttons': function (t) {
    return [{
      icon: 'https://itero-powerup.netlify.app/icon.png',
      text: 'Complete Task 🎯',
      callback: function (t) {
        return t.card('id')
          .then(function (card) {
            return fetch('https://itero-api-fme7.onrender.com/api/tasks/complete', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                user_id: 1,       // Temporary hardcoded user for MVP
                task_id: card.id  // Use Trello card ID as task reference
              })
            });
          })
          .then(res => res.json())
          .then(data => {
            alert("✅ Task complete!\nXP: " + data.xp + " | Streak: " + data.streak_count);
          })
          .catch(err => {
            alert("❌ Failed to complete task.");
            console.error(err);
          });
      }
    }];
  }
});
