import React, { useEffect, useState } from 'react';
import styles from '../../styles/components/MotivationDashboard.module.css';
import { getStreakData } from '../../services/analyticsService.js';

const StreakTracker = ({ userId, refreshKey }) => {
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreak = async () => {
      setLoading(true);
      try {
        const data = await getStreakData(userId);
       if (data.streaks && data.streaks.length > 0) {
          const daily = data.streaks.find(s => s.type === 'daily');
          setStreak(daily || null);
        }
      } catch (err) {
        console.error('Failed to load streak data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchStreak();
  }, [userId, refreshKey]);

  return (
    <div className={styles.innerCard}>
      <div className={styles.streakList}>
        {loading ? (
          <p className={styles.syncText}>🔄 Syncing streak...</p>
        ) : streak ? (
          <p className={styles.streakValue}>
            🔥 <strong>{streak.count}</strong> day streak
          </p>
        ) : (
          <p>No streak yet</p>
        )}
      </div>
    </div>
  );
};

export default StreakTracker;
