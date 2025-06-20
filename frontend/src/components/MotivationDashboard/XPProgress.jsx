import React, { useEffect, useState } from 'react';
import styles from '../../styles/components/MotivationDashboard.module.css';
import { getXPData } from '../../services/analyticsService.js';

const XPProgress = ({ userId, refreshKey }) => {
  const [xp, setXp] = useState(0);
  const [nextLevel, setNextLevel] = useState(100);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchXP = async () => {
      setLoading(true);
      try {
        const data = await getXPData(userId);
        setXp(data.xp);
        setNextLevel(data.next_level_xp);
      } catch (err) {
        console.error('Failed to load XP data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchXP();
  }, [userId, refreshKey]);

  const progressPercent = Math.min((xp / nextLevel) * 100, 100);

  return (
    <div className={styles.innerCard}>
      {loading ? (
        <p className={styles.syncText}>🔄 Syncing XP...</p>
      ) : (
        <div className={styles.progressBarContainer}>
          <div className={styles.progressBar} style={{ width: `${progressPercent}%` }} />
          <span className={styles.progressText}>{xp} / {nextLevel} XP</span>
        </div>
      )}
    </div>
  );
};

export default XPProgress;
