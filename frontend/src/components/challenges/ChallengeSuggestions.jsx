import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import styles from '../../styles/components/ChallengeSuggestions.module.css';
import { API_BASE } from '../../services/analyticsService';

const ChallengeSuggestions = ({ userId, onChallengeAccepted }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError(null);  // Reset error

    fetch(`${API_BASE}/api/challenges/suggestions?trello_member_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSuggestions(data);
        } else {
          console.warn("Unexpected data format:", data);
          setSuggestions([]);
          setError(data?.error || "Unexpected response");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load challenge suggestions:', err);
        setError("Network error or server not responding");
        setLoading(false);
      });
  }, [userId]);

  const handleAcceptChallenge = async (templateId) => {
    try {
      const res = await fetch(`${API_BASE}/api/challenges/accept/${templateId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trello_member_id: userId })
      });

      const data = await res.json();
      if (res.ok) {
        setSuggestions(prev => prev.filter(t => t.id !== templateId));
        if (onChallengeAccepted) onChallengeAccepted();
      } else {
        console.warn('Failed to accept challenge:', data.message || data.error);
      }
    } catch (err) {
      console.error('Error accepting challenge:', err);
    }
  };

  return (
    <Card>
      {loading ? (
        <p className={styles.placeholder}>🔄 Loading suggestions...</p>
      ) : error ? (
        <p className={styles.placeholder}>⚠️ {error}</p>
      ) : suggestions.length === 0 ? (
        <p className={styles.placeholder}>
          All challenges are currently in progress or cooling down. <br />
          New challenges will appear soon!
        </p>
      ) : (
        <div className={styles.suggestionGrid}>
          {suggestions.map((template) => (
            <div key={template.id} className={styles.card}>
              <div className={styles.title}>{template.title}</div>
              <div className={styles.description}>{template.description}</div>
              <button
                className={styles.button}
                onClick={() => handleAcceptChallenge(template.id)}
              >
                Accept Challenge
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ChallengeSuggestions;
