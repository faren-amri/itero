useEffect(() => {
  if (!isReady || !card || !member) return;

  const payload = {
    trello_user_id: member.id,
    trello_username: member.username,
    task_id: card.id
  };

  fetch('https://itero-api.onrender.com/api/tasks/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      setUserId(data.user_id || null);
      setStatusMessage(`✅ Task complete!\nXP: ${data.xp} | Streak: ${data.streak_count}`);
      setIsTaskComplete(true);

      // ✅ Toast notification
      t.showNotification({
        message: `🎉 Task complete! +${data.xp} XP | Level ${data.level}`,
        duration: 5
      });
    })
    .catch(err => {
      console.error("❌ Task completion error:", err);
      setStatusMessage('❌ Could not complete task.');
    });
}, [isReady, card, member]);

export default MotivationDashboardPage;
