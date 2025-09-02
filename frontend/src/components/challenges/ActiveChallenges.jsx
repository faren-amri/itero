import React, { useEffect, useState } from 'react';
import { API_BASE } from '../../services/analyticsService';
import sharedStyles from '../../styles/shared/Shared.module.css';
import styles from '../../styles/components/ActiveChallenges.module.css';

function ActiveChallenges({ userId, refreshKey }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        if (!userId) { if (!cancelled) setItems([]); return; }
        const res = await fetch(
          `${API_BASE}/api/challenges/active?trello_member_id=${encodeURIComponent(userId)}&t=${Date.now()}`,
          { cache: 'no-store' }
        );
        const data = await res.json().catch(() => []);
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [userId, refreshKey]);

  const pct = (progress, goal) => {
    const g = Number(goal || 0);
    const p = Number(progress || 0);
    if (!g) return 0;
    const v = Math.round((p / g) * 100);
    return Math.max(0, Math.min(100, v));
  };

  if (loading) {
    return (
      <div className={styles.innerCard}>
        <p className={sharedStyles.muted}>Loading active challenges…</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className={styles.innerCard}>
        <p className={sharedStyles.muted}>
          No Active Challenge!
        </p>
      </div>
    );
  }

  return (
    <div className={styles.innerCard}>
      <div className={styles.listColumn}>
        {items.map(c => {
          const percent = pct(c.progress, c.goal);
          return (
            <div key={c.id} className={sharedStyles.card}>
              <div className={styles.challengeTitle}>{c.title}</div>
              {c.description && (
                <div className={styles.challengeDescription} style={{ marginTop: 4 }}>
                  {c.description}
                </div>
              )}
              <div className={styles.progressRow}>
                <div className={styles.progressBarContainer}>
                  <div className={styles.progressBar} style={{ width: `${percent}%` }} />
                </div>
                <div className={styles.progressFill} style={{ marginLeft: 8 }}>{percent}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>

  );
}
export default ActiveChallenges;
