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
                const payload = {
                  trello_user_id: member.id,
                  trello_username: member.username,
                  task_id: card.id
                };

                console.log("📤 Sending task data:", payload);

                return fetch('https://itero-api-fme7.onrender.com/api/tasks/complete', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(payload)
                });
              });
          })
          .then(async res => {
            const text = await res.text();
            try {
              const data = JSON.parse(text);
              alert("✅ Task complete!\nXP: " + data.xp + " | Streak: " + data.streak_count);
            } catch (e) {
              console.error("❌ Server response not JSON:", text);
              alert("❌ Server error: Could not complete task.\nCheck logs for details.");
            }
          })
          .catch(err => {
            console.error("❌ Network error:", err);
            alert("❌ Network error. Failed to reach the server.");
          });
      }
    }];
  }
});
