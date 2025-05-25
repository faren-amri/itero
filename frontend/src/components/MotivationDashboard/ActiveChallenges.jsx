// src/components/dashboard/ActiveChallenges.jsx
import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import styles from '../../styles/components/ActiveChallenges.module.css';

const ActiveChallenges = ({ userId }) => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   fetch(`https://itero-api.onrender.com/api/challenges/active?trello_member_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        setChallenges(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load active challenges', err);
        setLoading(false);
      });
  }, []);

  return (
    <Card title="Active Challenges">
      {loading ? (
        <p>Loading challenges...</p>
      ) : challenges.length === 0 ? (
        <p>No active challenges</p>
      ) : (
        <ul className={styles.challengeList}>
          {challenges.map(ch => (
            <li key={ch.id} className={styles.challengeItem}>
              <div className={styles.challengeTitle}>{ch.title}</div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${ch.progress}%` }}
                ></div>
              </div>
              <span className={styles.progressText}>{ch.progress}% complete</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default ActiveChallenges;
