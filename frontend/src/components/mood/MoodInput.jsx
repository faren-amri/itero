// src/components/mood/MoodInput.jsx
import React, { useState } from 'react';
import styles from '../../styles/components/MoodInput.module.css';
import { API_BASE } from '../../services/analyticsService';

const moods = ["Burned Out", "Tired", "Neutral", "Energized", "Great"];

const MoodInput = ({ userId, onMoodLogged }) => {
  const [submitting, setSubmitting] = useState(false);
  const [loggedMood, setLoggedMood] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleMoodSelect = async (mood) => {
    if (!userId || submitting) return;
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE}/api/moods/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trello_member_id: userId, mood }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setLoggedMood(data.mood || mood);
        onMoodLogged?.();
      } else {
        setErrorMsg(data.message || data.error || 'Could not log mood.');
      }
    } catch {
      setErrorMsg('Network error while logging mood.');
    } finally {
      setSubmitting(false);
    }
  };

  // 🔹 purely presentational: map mood → pill class (no logic changes)
  const moodClass = (m) =>
    m === "Burned Out" ? styles.btnBurned :
    m === "Neutral"    ? styles.btnNeutral :
    m === "Great"      ? styles.btnGreat :
    ""; // Tired/Energized use default pill style

  return (
    <div className={styles.moodInput}>
      <h3>How are you feeling today?</h3>

      {errorMsg && <p className={styles.error}>{errorMsg}</p>}

      {loggedMood ? (
        <p className={styles.confirmation}>
          You logged: <strong>{loggedMood}</strong>
        </p>
      ) : (
        <div className={styles.buttons} role="group" aria-label="Mood options">
          {moods.map((m) => (
            <button
              key={m}
              className={moodClass(m)}
              onClick={() => handleMoodSelect(m)}
              disabled={submitting}
            >
              {m}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoodInput;
