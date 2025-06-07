import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import styles from '../../styles/components/MotivationDashboard.module.css';
import { getXPData } from '../../services/analyticsService.js';

const XPProgress = ({ userId }) => {
  const [xp, setXp] = useState(0);
  const [nextLevel, setNextLevel] = useState(100);

  useEffect(() => {
    const fetchXP = async () => {
      try {
        const data = await getXPData(userId);
        setXp(data.xp);
        setNextLevel(data.next_level_xp);
      } catch (err) {
        console.error('Failed to load XP data:', err);
      }
    };

    fetchXP();
  }, [userId]);

  const progressPercent = Math.min((xp / nextLevel) * 100, 100);

  return (
    <Card>
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar} style={{ width: `${progressPercent}%` }} />
        <span className={styles.progressText}>{xp} / {nextLevel} XP</span>
      </div>
    </Card>
  );
};

export default XPProgress;
