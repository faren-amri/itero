import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { trello as t } from '../lib/trello.js';
import { api } from '../services/analyticsService'; // ← centralized axios instance

const TaskCompleteModal = () => {
  const [status, setStatus] = useState('⏳ Completing task...');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (!t) { if (!cancelled) setStatus('❌ Not inside Trello'); return; }

        const cardId = t.arg('cardId') || t.arg('card');
        const memberId = t.arg('member');

        if (!cardId || !memberId) {
          if (!cancelled) setStatus('❌ Missing task info.');
          return;
        }

        const { data } = await api.post('/api/tasks/complete', {
          trello_user_id: memberId,
          task_id: cardId,
          source: 'task',
        });

        if (!data) throw new Error('Empty response');

        const { xp_gained, level, streak_count, completed_challenges } = data;
        const xp = xp_gained ?? 10;
        const lvl = level ?? '✓';
        const streak = streak_count ?? 0;
        const done = Array.isArray(completed_challenges) ? completed_challenges.length : 0;

        const parts = [`+${xp} XP`, `Level ${lvl}`];
        if (streak) parts.push(`${streak}-day streak`);
        if (done) parts.push(`${done} challenge${done > 1 ? 's' : ''} completed`);
        const msg = `🎉 ${parts.join(' · ')}`;

        if (!cancelled) {
          toast.success(msg, { autoClose: 2000 });
          setStatus(`✅ ${msg}`);
        }

        setTimeout(() => t.closeModal(), 2100);
      } catch (err) {
        if (!cancelled) {
          toast.error('Could not complete task', { autoClose: 2000 });
          setStatus('❌ Could not complete task.');
        }
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const toastTheme =
    (typeof document !== 'undefined' &&
      document.body?.getAttribute('data-theme') === 'dark')
      ? 'dark'
      : 'light';

  return (
    <div style={{ textAlign: 'center', padding: 24, fontWeight: 'bold', fontSize: 18, color: 'var(--text-main)' }}>
      <p>{status}</p>
      <ToastContainer position="top-center" theme={toastTheme} autoClose={2000} />
    </div>
  );
};

export default TaskCompleteModal;
