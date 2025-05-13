import React, { useState } from 'react';
import styles from '../../styles/shared/Shared.module.css';
import modalStyles from '../../styles/components/MoodModal.module.css';

const MoodModal = ({ onClose, onSubmit }) => {
  const [mood, setMood] = useState(3); // Default mood

  const handleSubmit = () => {
    onSubmit(mood);
    onClose();
  };

  return (
    <div className={modalStyles.overlay}>
      <div className={modalStyles.modal}>
        <h3 className={styles.cardTitle}>How are you feeling today?</h3>
        <div className={modalStyles.emojiRow}>
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              className={`${modalStyles.emoji} ${mood === level ? modalStyles.active : ''}`}
              onClick={() => setMood(level)}
            >
              {['😞', '😕', '😐', '😊', '😄'][level - 1]}
            </button>
          ))}
        </div>
        <div className={modalStyles.actions}>
          <button className={modalStyles.submit} onClick={handleSubmit}>Submit</button>
          <button className={modalStyles.cancel} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default MoodModal;
