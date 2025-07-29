import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TaskCompleteModal = () => {
  const [status, setStatus] = useState('⏳ Completing task...');

  useEffect(() => {
    const t = window.TrelloPowerUp.iframe();
    const isDev = window.location.hostname.includes('localhost') || window.location.search.includes('debug');

    const args = t.args[1] || t.args.context || {};
    const cardId = isDev ? 'mock-card-id' : args.cardId || args.card;
    const memberId = isDev ? 'mock-member-id' : args.memberId || args.member;

    if (!cardId || !memberId) {
      toast.error("❌ Missing Trello card or user info.");
      setStatus('❌ Missing task info.');
      return;
    }

    axios.post('https://itero-api-fme7.onrender.com/api/tasks/complete', {
      trello_user_id: memberId,
      task_id: cardId,
      source: "task" 
    })
      .then(res => {
        const data = res.data;
        const xp = data?.xp_gained ?? 10;
        const lvl = data?.level ?? '✓';
        const streak = data?.streak_count ?? 0;

        toast.success(`🎉 +${xp} XP · Level ${lvl} · 🔥 ${streak}-day streak`, {
          autoClose: 2500
        });

        setStatus(`✅ XP: ${xp} | Level: ${lvl} | 🔥 Streak: ${streak}`);
        setTimeout(() => t.closeModal(), 2600);
      })
      .catch(err => {
        console.error("❌ Task completion failed:", err);
        toast.error("❌ Failed to complete task.");
        setStatus('❌ Could not complete task.');
      });
  }, []);

  return (
    <div style={{
      textAlign: 'center',
      padding: '24px',
      fontWeight: 'bold',
      fontSize: '18px',
      color: 'var(--text-main)',
    }}>
      <p>{status}</p>
      <ToastContainer position="top-center" theme="dark" autoClose={2500} />
    </div>
  );
};

export default TaskCompleteModal;
