import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TaskCompleteModal = () => {
  const [status, setStatus] = useState('⏳ Completing task...');

  useEffect(() => {
    const t = window.TrelloPowerUp.iframe();
    const context = t.getContext();
    const cardId = context.card;
    const memberId = context.member;

    axios.post('https://itero-api-fme7.onrender.com/api/tasks/complete', {
      trello_user_id: memberId,
      task_id: cardId
    })
    .then(() => {
      toast.success("🎉 XP gained and challenge updated!", { autoClose: 2500 });
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
      <ToastContainer
        position="top-center"
        theme="dark"
        autoClose={2500}
      />
    </div>
  );
};

export default TaskCompleteModal;
