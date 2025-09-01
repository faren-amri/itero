import React, { useEffect, useState } from 'react';
import { API_BASE } from '../../services/analyticsService';

function ActiveChallenges({ userId, refreshKey }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}/api/challenges/active?trello_member_id=${encodeURIComponent(
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

    return () => {
      cancelled = true;
    };
  }, [userId, refreshKey]);

  if (loading) return <div>Loading active challenges…</div>;
  if (!items.length) return <div>No active challenges</div>;

  return (
    <div className="active-challenges">
      {items.map((c) => (
        <div key={c.id} className="challenge-card">
          <div className="title">{c.title}</div>
          <div className="meta">Started: {c.started_at?.slice(0, 10) || '-'}</div>
        </div>
      ))}
    </div>
  );
}

export default ActiveChallenges;
