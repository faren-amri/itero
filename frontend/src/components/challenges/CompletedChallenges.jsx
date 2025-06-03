import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import styles from '../../styles/components/ActiveChallenges.module.css';
import { API_BASE } from '../../services/analyticsService';

const CompletedChallenges = ({ userId }) => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    if (!userId) return;

    fetch(`${API_BASE}/api/challenges/completed?trello_member_id=${userId}`)
      .then(res => res.json())
      .then(data => setChallenges(data || []))
      .catch(err => console.error('Failed to load completed challenges', err));
  }, [userId]);

  if (challenges.length === 0) return null;

  return (
    <Card title="Completed Challenges">
      <ul className={styles.challengeList}>
        {challenges.map(ch => (
          <li key={ch.id} className={styles.challengeItem}>
            <div className={styles.challengeTitle}>{ch.title}</div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `100%` }}></div>
            </div>
            <span className={styles.progressText}>Completed</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default CompletedChallenges;
