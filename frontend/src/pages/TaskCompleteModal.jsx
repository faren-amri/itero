import { useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TaskCompleteModal = () => {
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
      toast.success("🎉 Task completed! XP + Challenge updated!");
      setTimeout(() => {
        t.closeModal(); // Auto-close after 2.5s
      }, 2500);
    })
    .catch(err => {
      console.error(err);
      toast.error("❌ Failed to complete task.");
    });
  }, []);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2500}
        theme="dark"
        hideProgressBar={false}
        pauseOnHover
        draggable
      />
    </>
  );
};

export default TaskCompleteModal;
