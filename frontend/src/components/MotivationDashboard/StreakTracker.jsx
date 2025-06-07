import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import styles from '../../styles/components/MotivationDashboard.module.css';
import { getStreakData } from '../../services/analyticsService.js';

const StreakTracker = ({ userId }) => {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const data = await getStreakData(userId);
        setStreak(data.count);
      } catch (err) {
        console.error('Failed to load streak data:', err);
      }
    };

    fetchStreak();
  }, [userId]);

  return (
    <Card>
      <p className={styles.streakValue}>🔥 {streak}-day streak</p>
    </Card>
  );
};

export default StreakTracker;
