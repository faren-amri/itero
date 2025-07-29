import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import styles from '../../styles/components/ActiveChallenges.module.css';
import { API_BASE } from '../../services/analyticsService';

const ActiveChallenges = ({ userId, refreshKey }) => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    fetch(`${API_BASE}/api/challenges/active?trello_member_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        setChallenges(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load active challenges', err);
        setLoading(false);
      });
  }, [userId, refreshKey]);

  return (
    <Card>
      {loading ? (
        <p className={styles.placeholder}>🔄 Syncing challenges...</p>
      ) : challenges.length === 0 ? (
        <p className={styles.placeholder}>No active challenges</p>
      ) : (
        <ul className={styles.challengeList}>
          {challenges.map(ch => {
            const goal = ch.goal || 1; // fallback to avoid division by zero
            const percent = Math.min(100, Math.round((ch.progress / goal) * 100));

            return (
              <li key={ch.id} className={styles.challengeItem}>
                <div className={styles.challengeHeader}>
                  <h4 className={styles.challengeTitle}>{ch.title}</h4>
                  <span className={styles.progressText}>{percent}%</span>
                </div>
                <p className={styles.challengeDescription}>{ch.description}</p>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${percent}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
};

export default ActiveChallenges;
