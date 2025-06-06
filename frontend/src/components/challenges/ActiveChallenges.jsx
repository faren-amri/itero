// src/components/dashboard/ActiveChallenges.jsx
import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import styles from '../../styles/components/ActiveChallenges.module.css';
import { API_BASE } from '../../services/analyticsService';

const ActiveChallenges = ({ userId }) => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

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
  }, [userId]);

  return (
    <Card>
      {loading ? (
        <p className={styles.placeholder}>Loading...</p>
      ) : challenges.length === 0 ? (
        <p className={styles.placeholder}>No active challenges</p>
      ) : (
        <ul className={styles.challengeList}>
          {challenges.map(ch => (
            <li key={ch.id} className={styles.challengeItem}>
              <div className={styles.challengeHeader}>
                <h4 className={styles.challengeTitle}>{ch.title}</h4>
                <span className={styles.progressText}>{ch.progress}%</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${ch.progress}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default ActiveChallenges;
