import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import styles from '../../styles/components/MotivationDashboard.module.css';
import { getStreakData } from '../../services/analyticsService.js';

const StreakTracker = ({ userId }) => {
  const [streaks, setStreaks] = useState([]);

  useEffect(() => {
    const fetchStreaks = async () => {
      try {
        const data = await getStreakData(userId);
        setStreaks(data.streaks || []);
      } catch (err) {
        console.error('Failed to load streak data:', err);
      }
    };

    fetchStreaks();
  }, [userId]);

  return (
    <Card>
      {streaks.length > 0 ? (
        streaks.map((streak) => (
          <p key={streak.type} className={styles.streakValue}>
            🔥 {streak.count}-day <strong>{streak.type}</strong> streak
          </p>
        ))
      ) : (
        <p className={styles.streakValue}>No streaks yet</p>
      )}
    </Card>
  );
};

export default StreakTracker;
