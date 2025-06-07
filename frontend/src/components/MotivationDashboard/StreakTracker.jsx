import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import styles from '../../styles/components/MotivationDashboard.module.css';
import { getStreakData } from '../../services/analyticsService.js';

const StreakTracker = ({ userId }) => {
  const [streaks, setStreaks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreaks = async () => {
      try {
        const data = await getStreakData(userId);
        console.log('Fetched streaks:', data); // 🔍 DEBUG

        if (data && Array.isArray(data.streaks)) {
          setStreaks(data.streaks);
        } else {
          setStreaks([]); // fallback
        }
      } catch (err) {
        console.error('Failed to load streak data:', err);
        setStreaks([]); // fallback on error
      } finally {
        setLoading(false);
      }
    };

    fetchStreaks();
  }, [userId]);

  if (loading) return <Card><p>Loading streaks...</p></Card>;

  return (
    <Card>
      {streaks.length === 0 ? (
        <p className={styles.streakValue}>No streaks yet</p>
      ) : (
        streaks.map((s, i) => (
          <p key={i} className={styles.streakValue}>
            🔥 {s.count}-day streak
          </p>
        ))
      )}
    </Card>
  );
};

export default StreakTracker;
