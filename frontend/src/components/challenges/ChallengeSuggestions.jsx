import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import styles from '../../styles/components/ChallengeSuggestions.module.css';
import { API_BASE } from '../../services/analyticsService';

const ChallengeSuggestions = ({ userId, onChallengeAccepted }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!userId) return;

    fetch(`${API_BASE}/api/challenges/suggestions?trello_member_id=${userId}`)
      .then(res => res.json())
      .then(data => setSuggestions(data || []))
      .catch(err => console.error('Failed to load challenge suggestions:', err));
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

  if (suggestions.length === 0) return null;

  return (
    <Card title="Suggested Challenges">
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
    </Card>
  );
};

export default ChallengeSuggestions;
