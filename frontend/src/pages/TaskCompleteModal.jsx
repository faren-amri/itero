// src/pages/TaskCompleteModal.jsx
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

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
    .then(res => {
      toast.success("🎉 Task completed! XP + Challenge updated!");
      setTimeout(() => t.closeModal(), 2500); // Auto-close after toast
    })
    .catch(err => {
      console.error(err);
      toast.error("❌ Failed to complete task.");
    });
  }, []);

  return null; // optional: show loading spinner or animation
};

export default TaskCompleteModal;
