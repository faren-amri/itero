import React, { useEffect, useState } from 'react';
import { useTrelloContext } from '../hooks/useTrelloContext';
import MotivationDashboard from '../components/MotivationDashboard/MotivationDashboard';

const MotivationDashboardPage = () => {
  const { t, card, member, isReady, loading, error } = useTrelloContext();
  const [userId, setUserId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Loading...');
  const [isTaskComplete, setIsTaskComplete] = useState(false);

  // 🔍 Debug logs to trace Trello context
  useEffect(() => {
    console.log("🧩 useTrelloContext:");
    console.log("t:", t);
    console.log("card:", card);
    console.log("member:", member);
    console.log("isReady:", isReady);
    console.log("loading:", loading);
    console.log("error:", error);
  }, [t, card, member, isReady, loading, error]);

  useEffect(() => {
    if (!isReady || !member || !t) return;

    if (card) {
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

          t.showNotification({
            message: `🎉 Task complete! +${data.xp} XP | Level ${data.level || '?'}`,
            duration: 5
          });
        })
        .catch(err => {
          console.error("❌ Task completion error:", err);
          setStatusMessage('❌ Could not complete task.');
        });
    } else {
      // Board-level launch
      setUserId(member.id);
      setIsTaskComplete(true);
      setStatusMessage("👤 Welcome! Loading your dashboard...");
    }
  }, [isReady, card, member, t]);

  return (
    <div style={{ padding: '2rem', color: 'black' }}>
      <h1>🎯 Motivation Dashboard</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading Trello context...</p>}
      {!loading && <p>{statusMessage}</p>}

      {!loading && isTaskComplete && userId && (
        <MotivationDashboard userId={userId} />
      )}

      {!loading && isTaskComplete && !userId && (
        <p>⚠️ Task complete, but no user ID returned.</p>
      )}
    </div>
  );
};

export default MotivationDashboardPage;
