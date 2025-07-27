import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import styles from '../../styles/components/ActiveChallenges.module.css';
import { API_BASE } from '../../services/analyticsService';

const CompletedChallenges = ({ userId, refreshKey }) => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    fetch(`${API_BASE}/api/challenges/completed?trello_member_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        setChallenges(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load completed challenges', err);
        setLoading(false);
      });
  }, [userId, refreshKey]);

  if (loading) {
    return (
      <Card>
        <p className={styles.placeholder}>🔄 Syncing completed challenges...</p>
      </Card>
    );
  }

  if (challenges.length === 0) {
    return (
      <Card>
        <p className={styles.placeholder}>No completed challenges yet</p>
      </Card>
    );
  }

  return (
    <Card>
      <ul className={styles.challengeList}>
        {challenges.map(ch => (
          <li key={ch.id} className={styles.challengeItem}>
            <div className={styles.challengeHeader}>
              <h4 className={styles.challengeTitle}>{ch.title}</h4>
              <span className={styles.completedLabel}>✓ Completed</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '100%' }} />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default CompletedChallenges;
