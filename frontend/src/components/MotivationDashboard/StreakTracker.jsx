import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import styles from '../../styles/components/MotivationDashboard.module.css';
import { getStreakData } from '../../services/analyticsService.js';

const StreakTracker = ({ userId }) => {
  const [streak, setStreak] = useState(null);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const data = await getStreakData(userId);
        // Show only the latest streak (e.g. first one in the array)
        if (data.streaks && data.streaks.length > 0) {
          const sorted = [...data.streaks].sort((a, b) =>
            new Date(b.last_updated) - new Date(a.last_updated)
          );
          setStreak(sorted[0]); // show the latest streak
        }
      } catch (err) {
        console.error('Failed to load streak data:', err);
      }
    };

    fetchStreak();
  }, [userId]);

  return (
    <Card>
      <h3 className={styles.sectionTitle}>🔥 Daily Streak</h3>
      <div className={styles.streakList}>
        {streak ? (
          <p className={styles.streakValue}>
            🔥 <strong>{streak.count}</strong> day streak
          </p>
        ) : (
          <p>No streak yet</p>
        )}
      </div>
    </Card>
  );
};

export default StreakTracker;
