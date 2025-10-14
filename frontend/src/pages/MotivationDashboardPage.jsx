import { useEffect, useState } from 'react';
import MotivationDashboard from '../components/MotivationDashboard/MotivationDashboard';
import { getTrelloArgsSafe } from '../services/trelloContext';

function MotivationDashboardPage() {
  const [trelloMemberId, setTrelloMemberId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { member } = await getTrelloArgsSafe();
      if (!cancelled) {
        setTrelloMemberId(member || null);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading…</div>;
  return <MotivationDashboard trelloMemberId={trelloMemberId} />;
}

export default MotivationDashboardPage;
