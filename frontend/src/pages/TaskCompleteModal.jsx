import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API = 'https://itero-api-fme7.onrender.com';

const TaskCompleteModal = () => {
  const [status, setStatus] = useState('⏳ Completing task...');

  useEffect(() => {
    (async () => {
      try {
        const t = window?.TrelloPowerUp?.iframe?.();
        if (!t) { setStatus('❌ Not inside Trello'); return; }

        const cardId = t.arg('cardId') || t.arg('card');
        const memberId = t.arg('member');

        if (!cardId || !memberId) {
          setStatus('❌ Missing task info.');
          return;
        }

        const res = await axios.post(`${API}/api/tasks/complete`, {
          trello_user_id: memberId,
          task_id: cardId,
          source: 'task'
        });

        const data = res?.data || {};
        const xp = data.xp_gained ?? 10;
        const lvl = data.level ?? '✓';
        const streak = data.streak_count ?? 0;

        toast.success(`🎉 +${xp} XP · Level ${lvl} · 🔥 ${streak}-day streak`, { autoClose: 2000 });
        setStatus(`✅ XP: ${xp} | Level: ${lvl} | 🔥 Streak: ${streak}`);

        setTimeout(() => t.closeModal(), 2100);
      } catch {
        setStatus('❌ Could not complete task.');
      }
    })();
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: 24, fontWeight: 'bold', fontSize: 18, color: 'var(--text-main)' }}>
      <p>{status}</p>
      <ToastContainer position="top-center" theme="dark" autoClose={2000} />
    </div>
  );
};

export default TaskCompleteModal;
