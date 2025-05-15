import React, { useEffect, useState } from 'react';
import MotivationDashboard from '../components/MotivationDashboard/MotivationDashboard';

const MotivationDashboardPage = () => {
  const [userId, setUserId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Completing task...');
  const [isTaskComplete, setIsTaskComplete] = useState(false);

  useEffect(() => {
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
        try {
          const data = JSON.parse(text);
          setUserId(data.user_id || null); // optional: only if returned
          setStatusMessage(`✅ Task complete!\nXP: ${data.xp} | Streak: ${data.streak_count}`);
          setIsTaskComplete(true);
        } catch (e) {
          console.error('❌ Invalid response:', text);
          setStatusMessage('❌ Could not complete task.');
        }
      })
      .catch(err => {
        console.error('❌ Network error:', err);
        setStatusMessage('❌ Network error. Try again later.');
      });
  }, []);

  return (
    <div style={{ padding: '2rem', color: 'white', fontFamily: 'Plus Jakarta Sans' }}>
      <h2>🎯 Motivation Dashboard</h2>
      <p style={{ marginBottom: '1rem' }}>{statusMessage}</p>

      {isTaskComplete && userId && (
        <MotivationDashboard userId={userId} />
      )}
    </div>
  );
};

export default MotivationDashboardPage;
