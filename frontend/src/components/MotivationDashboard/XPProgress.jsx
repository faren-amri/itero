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
        setXp(Number(data.xp) || 0);
        setNextLevel(Number(data.next_level_xp) || 100);
      } catch {
        setXp(0);
        setNextLevel(100);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchXP();
  }, [userId, refreshKey]);

  const progressPercent = Math.min((xp / nextLevel) * 100 || 0, 100);

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
