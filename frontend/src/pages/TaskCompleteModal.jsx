import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { trello as t } from '../lib/trello.js';


const API = 'https://itero-api-fme7.onrender.com';

const TaskCompleteModal = () => {
  const [status, setStatus] = useState('⏳ Completing task...');

  useEffect(() => {
    (async () => {
      try {
        if (!t) { setStatus('❌ Not inside Trello'); return; }

        const cardId = t.arg('cardId') || t.arg('card');
        const memberId = t.arg('member');

        if (!cardId || !memberId) {
          setStatus('❌ Missing task info.');
          return;
        }

        const res = await axios.post(`${API}/api/tasks/complete`, {
          trello_user_id: memberId,   // ✅ raw string id
          task_id: cardId,
          source: 'task'
        });

        if (!res?.data) throw new Error('Empty response');

        const { xp_gained, level, streak_count, completed_challenges } = res.data;
        const xp = xp_gained ?? 10;
        const lvl = level ?? '✓';
        const streak = streak_count ?? 0;
        const done = Array.isArray(completed_challenges) ? completed_challenges.length : 0;

        let msg = `🎉 +${xp} XP · Level ${lvl} · 🔥 ${streak}-day streak`;
        if (done > 0) msg += ` · 🏆 ${done} challenge${done > 1 ? 's' : ''} completed`;

        toast.success(msg, { autoClose: 2000 });
        setStatus(`✅ ${msg}`);

        setTimeout(() => t.closeModal(), 2100);
      } catch (err) {
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
