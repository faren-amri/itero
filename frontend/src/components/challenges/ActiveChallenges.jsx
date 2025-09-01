import React, { useEffect, useState } from 'react';
import { API_BASE } from '../../services/analyticsService';
import sharedStyles from '../../styles/shared/Shared.module.css';
import styles from '../../styles/components/MotivationDashboard.module.css';

function ActiveChallenges({ userId, refreshKey }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Normalize: accept number/string or an object with .id
  const normalizedUserId =
    typeof userId === 'number' || (typeof userId === 'string' && userId.trim() !== '')
      ? userId
      : (userId && typeof userId === 'object' && (userId.id ?? userId.userId)) || '';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        if (!normalizedUserId) {
          // nothing to query yet
          if (!cancelled) setItems([]);
          return;
        }
        const url = `${API_BASE}/api/challenges/active?user_id=${encodeURIComponent(
          normalizedUserId
        )}&t=${Date.now()}`;

        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) {
          // surface server errors in console so you can see them
          const txt = await res.text().catch(() => '');
          console.error('ActiveChallenges fetch failed:', res.status, txt);
        }
        const data = await res.json().catch(() => []);
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('ActiveChallenges fetch error:', err);
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [normalizedUserId, refreshKey]);

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
        {items.map((c) => {
          const pct = Math.max(0, Math.min(100, Number(c.progress_percent ?? 0)));
          return (
            <div key={c.id} className={sharedStyles.card}>
              <div className={sharedStyles.cardTitle}>{c.title}</div>
              {c.description && (
                <div className={sharedStyles.muted} style={{ marginTop: 4 }}>
                  {c.description}
                </div>
              )}
              <div className={styles.progressRow}>
                <div className={styles.progressBarContainer}>
                  <div className={styles.progressBar} style={{ width: `${pct}%` }} />
                </div>
                <div className={sharedStyles.muted} style={{ marginLeft: 8 }}>{pct}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ActiveChallenges;
