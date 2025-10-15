import React, { useEffect, useState } from 'react';
import styles from '../../styles/components/MotivationDashboard.module.css';
import shared from '../../styles/shared/Shared.module.css';
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
        setXp(Number(data?.xp) || 0);
        setNextLevel(Number(data?.next_level_xp) || 100);
      } catch {
        setXp(0);
        setNextLevel(100);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchXP();
  }, [userId, refreshKey]);

  // guard against 0/NaN and clamp to [0,100]
  const raw = nextLevel > 0 ? (xp / nextLevel) * 100 : 0;
  const pct = Math.min(100, Math.max(0, Math.round(raw)));

  if (loading) return <p className={styles.syncText}>🔄 Syncing XP…</p>;

  return (
    <>
      <div className={shared.kpi}>{xp} / {nextLevel} XP</div>
      <span className={shared.kpiSub}>Level Progress</span>
      <div className={styles.progressBarContainer} style={{ marginTop: 8 }}>
        <div
          className={styles.progressBar}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </>
  );
};

export default XPProgress;
