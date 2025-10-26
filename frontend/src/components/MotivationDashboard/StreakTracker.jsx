import React, { useEffect, useState } from 'react';
import styles from '../../styles/components/MotivationDashboard.module.css';
import shared from '../../styles/shared/Shared.module.css';import { getStreakData } from '../../services/analyticsService.js';

const StreakTracker = ({ userId, refreshKey }) => {
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreak = async () => {
      setLoading(true);
      try {
        const data = await getStreakData(userId);
        if (data.streaks && data.streaks.length > 0) {
          const daily = data.streaks.find((s) => s.type === 'daily');
          setStreak(daily || null);
        } else {
          setStreak(null);
        }
      } catch {
        setStreak(null);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchStreak();
  }, [userId, refreshKey]);

  if (loading) return <p className={styles.syncText}>🔄 Syncing streak…</p>;
  if (!streak)  return <p className={styles.syncText}>No streak yet</p>;

  return (
    <>
      <div className={styles.streakValue}>
        🔥 {streak.count} {streak.count === 1 ? 'day' : 'days'}
      </div>

      <div className={shared.kpiSub}>Keep it going — complete a task today</div>
    </>
  );
};

export default StreakTracker;
