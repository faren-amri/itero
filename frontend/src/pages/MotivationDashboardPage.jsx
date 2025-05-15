import React, { useEffect, useState } from 'react';
import MotivationDashboard from '../components/MotivationDashboard/MotivationDashboard';

const MotivationDashboardPage = () => {
  const [userId, setUserId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Completing task…');
  const [isTaskComplete, setIsTaskComplete] = useState(false);

  useEffect(() => {
    if (!window.TrelloPowerUp || !window.TrelloPowerUp.iframe) {
      console.warn("🚫 Not inside Trello iframe — skipping task completion.");
      return;
    }

    const t = window.TrelloPowerUp.iframe();

    Promise.all([
      t.card('id'),
      t.member('id', 'fullName', 'username')
    ])
      .then(([card, member]) => {
        const payload = {
          trello_user_id: member.id,
          trello_username: member.username,
          task_id: card.id
        };

        console.log('📤 Sending task completion:', payload);

        return fetch('https://itero-api-fme7.onrender.com/api/tasks/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      })
      .then(async (res) => {
        const text = await res.text();
        console.log("🧾 Server response:", text);

        try {
          const data = JSON.parse(text);
          setUserId(data.user_id || null);
          setStatusMessage(`✅ Task complete!\nXP: ${data.xp} | Streak: ${data.streak_count}`);
          setIsTaskComplete(true);
        } catch (e) {
          console.error('❌ Invalid JSON from server:', text);
          setStatusMessage('❌ Server error. Could not complete task.');
        }
      })
      .catch(err => {
        console.error('❌ Network error:', err);
        setStatusMessage('❌ Network error. Try again later.');
      });
  }, []);

  return (
    <div style={{ padding: '2rem', color: 'black' }}>
      <h1>🎯 Motivation Dashboard</h1>
      {!isTaskComplete ? (
        <p style={{ fontSize: '18px', fontWeight: 600 }}>{statusMessage}</p>
      ) : userId ? (
        <MotivationDashboard userId={userId} />
      ) : (
        <p>⚠️ Task complete, but no user ID found.</p>
      )}
    </div>
  );
};

export default MotivationDashboardPage;
