// src/components/mood/MoodInput.jsx
import React, { useState } from 'react';
import styles from '../../styles/components/MoodInput.module.css';
import { API_BASE } from '../../services/analyticsService';

const MOODS = ['Burned Out', 'Tired', 'Neutral', 'Energized', 'Great'];

const MoodInput = ({ userId, onMoodLogged }) => {
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState(null);   // optimistic selection (for styling)
  const [loggedMood, setLoggedMood] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleMoodSelect = async (mood) => {
    if (!userId || submitting) return;

    // optimistic highlight
    setSelected(mood);
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
        const saved = data?.mood || mood;
        setLoggedMood(saved);
        onMoodLogged?.();
      } else {
        setErrorMsg(data?.message || data?.error || 'Could not log mood.');
        setSelected(null);
      }
    } catch {
      setErrorMsg('Network error while logging mood.');
      setSelected(null);
    } finally {
      setSubmitting(false);
    }
  };

  // map mood -> pill class and selected state
  const moodClasses = (m) => {
    const base =
      m === 'Burned Out' ? styles.btnBurned :
      m === 'Tired'      ? styles.btnTired  :
      m === 'Neutral'    ? styles.btnNeutral:
      m === 'Energized'  ? styles.btnEnergized :
      /* Great */          styles.btnGreat;

    const selectedCls = selected === m ? styles.isSelected : '';
    return [base, selectedCls].filter(Boolean).join(' ');
  };

  return (
    <div className={styles.moodInput}>
      <h3>How are you feeling today?</h3>

      {!!errorMsg && <p className={styles.error} role="alert">{errorMsg}</p>}

      {loggedMood ? (
        <p className={styles.confirmation}>
          You logged: <strong>{loggedMood}</strong>
        </p>
      ) : (
        <div className={styles.buttons} role="group" aria-label="Mood options">
          {MOODS.map((m) => (
            <button
              key={m}
              type="button"
              className={moodClasses(m)}
              onClick={() => handleMoodSelect(m)}
              disabled={submitting}
              aria-pressed={selected === m}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {/* subtle inline status */}
      {submitting && (
        <div className={styles.confirmation} aria-live="polite" style={{ marginTop: 8 }}>
          Saving…
        </div>
      )}
    </div>
  );
};

export default MoodInput;
