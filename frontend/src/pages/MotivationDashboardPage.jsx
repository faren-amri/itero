import React, { useEffect, useState } from 'react';
import MotivationDashboard from '../components/MotivationDashboard/MotivationDashboard';

const MotivationDashboardPage = () => {
  const [userId, setUserId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Completing task…');
  const [isTaskComplete, setIsTaskComplete] = useState(false);
  const [notInTrello, setNotInTrello] = useState(false);

  useEffect(() => {
    const waitForTrello = async () => {
      const t = window.TrelloPowerUp?.iframe?.();
      if (!t) {
        console.warn("🚫 Not inside Trello iframe — skipping task completion.");
        setNotInTrello(true);
        return;
      }

      try {
        // Wait for Trello to provide context
        const [card, member] = await Promise.all([
          t.card('id'),
          t.member('id', 'username')
        ]);

        console.log("📦 Trello iframe context loaded!", { card, member });

        const payload = {
          trello_user_id: member.id,
          trello_username: member.username,
          task_id: card.id
        };

        const response = await fetch('https://itero-api.onrender.com/api/tasks/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const text = await response.text();

        try {
          const data = JSON.parse(text);
          setUserId(data.user_id || null);
          setStatusMessage(`✅ Task complete!\nXP: ${data.xp} | Streak: ${data.streak_count}`);
          setIsTaskComplete(true);
        } catch (e) {
          console.error('❌ Failed to parse server response:', text);
          setStatusMessage('❌ Server error: invalid response');
        }

      } catch (err) {
        console.error('❌ Trello context or network error:', err);
        setStatusMessage('❌ Could not complete task.');
      }
    };

    waitForTrello();
  }, []);

  return (
    <div style={{ padding: '2rem', color: 'black' }}>
      <h1>🎯 Motivation Dashboard</h1>

      {notInTrello ? (
        <p>⚠️ Please open this Power-Up inside Trello.</p>
      ) : !isTaskComplete ? (
        <p style={{ fontSize: '18px', fontWeight: 600 }}>{statusMessage}</p>
      ) : userId ? (
        <MotivationDashboard userId={userId} />
      ) : (
        <p>⚠️ Task complete, but no user ID returned.</p>
      )}
    </div>
  );
};

export default MotivationDashboardPage;
