import React, { useEffect, useState } from 'react';
import { API_BASE } from '../../services/analyticsService';
import Sharedstyles from '../../styles/shared/Shared.module.css';
import styles from '../../styles/components/ChallengeSuggestions.module.css';

function ChallengeSuggestions({ userId, onChallengeAccepted }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}/api/challenges/suggestions?trello_member_id=${encodeURIComponent(
            userId
          )}`
        );
        const data = await res.json().catch(() => []);
        if (!cancelled) setSuggestions(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setSuggestions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [userId]);

  const accept = async (templateId) => {
    if (busyId) return;
    setBusyId(templateId);
    try {
      const res = await fetch(`${API_BASE}/api/challenges/accept/${templateId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trello_member_id: userId })
      });
      let payload = null;
      try { payload = await res.json(); } catch { payload = null; }
      const msg = (payload?.message || payload?.error || '').toString();
      const alreadyAccepted = res.status === 400 && /already\s*accepted/i.test(msg);

      if (res.ok || alreadyAccepted) {
        setSuggestions(prev => prev.filter(s => s.id !== templateId));
        onChallengeAccepted?.();
      } else {
      }
    } catch {
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className={styles.innerCard}>
      {loading ? (
        <p className={styles.muted}>Loading suggestions…</p>
      ) : suggestions.length === 0 ? (
        <p className={styles.muted}>No suggestions! <br/>
        New challenges will appear soon!</p>
      ) : (
        <div className={styles.listColumn}>
          {suggestions.map(s => (
            <div key={s.id} className={styles.card}>
              <div className={styles.cardTitle}>{s.title}</div>
              {s.description && <p className={styles.muted}>{s.description}</p>}
              <div style={{ marginTop: 8 }}>
                <button
                  className={styles.button}
                  onClick={() => accept(s.id)}
                  disabled={busyId === s.id}
                  aria-busy={busyId === s.id}
                >
                  {busyId === s.id ? 'Adding…' : 'Accept Challenge'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChallengeSuggestions;
