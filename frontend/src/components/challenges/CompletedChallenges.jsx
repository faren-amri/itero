import React, { useEffect, useState } from 'react';
import sharedStyles from '../../styles/shared/shared.module.css';
import { API_BASE } from '../../services/analyticsService';

function CompletedChallenges({ userId, trelloMemberId, refreshKey }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  const memberId = userId ?? trelloMemberId;

  useEffect(() => {
    const onChanged = () => setTick(t => t + 1);
    window.addEventListener('itero:challenges-changed', onChanged);
    return () => window.removeEventListener('itero:challenges-changed', onChanged);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        if (!memberId) {
          setItems([]);
          return;
        }
        const res = await fetch(
          `${API_BASE}/api/challenges/completed?trello_member_id=${encodeURIComponent(memberId)}&t=${Date.now()}`,
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
  }, [memberId, refreshKey, tick]);

  if (loading) return <div className={sharedStyles.muted}>Loading…</div>;
  if (!items.length) return <div className={sharedStyles.muted}>No completed challenges</div>;

  return (
    <div className={styles.grid}>
      {items.map(c => (
        <div key={c.id} className={sharedStyles.card}>
          <div className={sharedStyles.cardTitle}>{c.title}</div>
          {c.description && (
            <div className={sharedStyles.muted} style={{ marginTop: 4 }}>
              {c.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default CompletedChallenges;
