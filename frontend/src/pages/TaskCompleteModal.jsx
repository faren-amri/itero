import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TaskCompleteModal = () => {
  const [status, setStatus] = useState('⏳ Completing task...');

  useEffect(() => {
    const t = window.TrelloPowerUp.iframe();
    const { cardId, memberId } = t.args[1] || t.args.context || {};

    if (!cardId || !memberId) {
      setStatus('❌ Missing card or member info.');
      return;
    }

    axios.post('https://itero-api-fme7.onrender.com/api/tasks/complete', {
      trello_user_id: memberId,
      task_id: cardId
    })
    .then(res => {
      const data = res.data;
      toast.success(`🎉 +${data.xp_gained} XP · Level ${data.level} · 🔥 ${data.streak_count}-day streak`, {
        autoClose: 2500
      });
      setStatus('✅ Task completed!');
      setTimeout(() => t.closeModal(), 2600);
    })
    .catch(err => {
      console.error(err);
      toast.error("❌ Failed to complete task.");
      setStatus('❌ Task failed.');
    });
  }, []);

  return (
    <div style={{
      textAlign: 'center',
      padding: '20px',
      fontWeight: 'bold',
      fontSize: '18px'
    }}>
      <p>{status}</p>
      <ToastContainer position="top-center" theme="dark" autoClose={2500} />
    </div>
  );
};

export default TaskCompleteModal;
