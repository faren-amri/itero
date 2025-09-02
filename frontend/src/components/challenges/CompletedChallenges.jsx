import React, { useEffect, useState } from 'react';
import { API_BASE } from '../../services/analyticsService';
import sharedStyles from '../../styles/shared/Shared.module.css';
import styles from '../../styles/components/MotivationDashboard.module.css';

function CompletedChallenges({ userId, refreshKey }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}/api/challenges/completed?trello_member_id=${encodeURIComponent(
            userId
          )}`
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

  if (loading) return <div className={styles.innerCard}><p className={sharedStyles.muted}>Loading completed challenges…</p></div>;
  if (!items.length) return <div className={styles.innerCard}><p className={sharedStyles.muted}>No completed challenges yet</p></div>;

  return (
    <div className={styles.innerCard}>
      <div className={styles.listColumn}>
        {items.map(c => (
          <div key={c.id} className={sharedStyles.card}>
            <div className={sharedStyles.cardBody}>
              {c.title}
            </div>
            <div className={styles.progressBarContainer} style={{ marginTop: 6 }}>
              <div className={styles.progressBar} style={{ width: '100%' }} />
            </div>
            <span className={sharedStyles.cardBody}> Completed</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompletedChallenges;
