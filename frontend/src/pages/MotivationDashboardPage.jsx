import React, { useEffect, useState } from 'react';
import MotivationDashboard from '../components/MotivationDashboard/MotivationDashboard';

const MotivationDashboardPage = () => {
  const [userId, setUserId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Completing task...');
  const [result, setResult] = useState(null);

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
          setUserId(data.user_id || null); // optional: set if needed
          setResult(data);
          setStatusMessage(`✅ Task complete! XP: ${data.xp} | Streak: ${data.streak_count}`);
        } catch (e) {
          console.error('❌ Response not JSON:', text);
          setStatusMessage('❌ Server error. Could not complete task.');
        }
      })
      .catch(err => {
        console.error('❌ Network error:', err);
        setStatusMessage('❌ Network error. Could not reach server.');
      });
  }, []);

  return (
    <div style={{ padding: '2rem', color: 'white' }}>
      <h2>🎯 Motivation Dashboard</h2>
      <p>{statusMessage}</p>

      {/* Optional: show full dashboard if needed */}
      {userId && <MotivationDashboard userId={userId} />}
    </div>
  );
};

export default MotivationDashboardPage;
