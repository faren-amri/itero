// src/components/mood/MoodInput.jsx
import React, { useState } from 'react';
import styles from '../../styles/components/MoodInput.module.css';
import { API_BASE } from '../../services/analyticsService';

const moods = ["Burned Out", "Tired", "Neutral", "Energized", "Great"];

const MoodInput = ({ userId, onMoodLogged }) => {
  const [submitting, setSubmitting] = useState(false);
  const [loggedMood, setLoggedMood] = useState(null);


  const handleMoodSelect = async (mood) => {

    if (!userId || submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/moods/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trello_member_id: userId, mood }),
      });

      const data = await res.json();
      if (res.ok) {
        setLoggedMood(data.mood);
        if (onMoodLogged) onMoodLogged(); // to refresh MoodTrends if needed
      } else {
        console.warn(data.message || data.error);
      }
    } catch (err) {
      console.error("Failed to log mood:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.moodInput}>
      <h3>How are you feeling today?</h3>
      {loggedMood ? (
        <p className={styles.confirmation}>You logged: <strong>{loggedMood}</strong></p>
      ) : (
        <div className={styles.buttons}>
          {moods.map(m => (
            <button key={m} onClick={() => handleMoodSelect(m)} disabled={submitting}>
              {m}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoodInput;
