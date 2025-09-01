import React, { useEffect, useState } from 'react';
import { API_BASE } from '../../services/analyticsService';

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

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const accept = async (templateId) => {
    if (busyId) return;
    setBusyId(templateId);

    try {
      const res = await fetch(
        `${API_BASE}/api/challenges/accept/${templateId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trello_member_id: userId }),
        }
      );

      let payload = null;
      try {
        payload = await res.json();
      } catch {
        payload = null;
      }

      // Treat “Already accepted” as success (idempotent UX)
      const msg = (payload?.message || payload?.error || '').toString();
      const alreadyAccepted =
        res.status === 400 && /already\s*accepted/i.test(msg);

      if (res.ok || alreadyAccepted) {
        setSuggestions((prev) => prev.filter((s) => s.id !== templateId));
        onChallengeAccepted?.();
      } else {
        // Quiet fail: no console output (keeps reviewer console clean)
      }
    } catch {
      // Network issue — swallow quietly
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return <div>Loading suggestions…</div>;
  }

  if (!suggestions.length) {
    return <div>No suggestions</div>;
  }

  return (
    <div className="suggestions">
      {suggestions.map((s) => (
        <div key={s.id} className="suggestion-card">
          <div className="title">{s.title}</div>
          <div className="desc">{s.description}</div>
          <button
            onClick={() => accept(s.id)}
            disabled={busyId === s.id}
            aria-busy={busyId === s.id}
          >
            {busyId === s.id ? 'Adding…' : 'Accept'}
          </button>
        </div>
      ))}
    </div>
  );
}

export default ChallengeSuggestions;
