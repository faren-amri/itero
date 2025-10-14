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
      if (!cancelled && member) {
        setTrelloMemberId(member);
      }
      if (!cancelled) {
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', color: 'white' }}>Loading…</div>;
  }

  if (!trelloMemberId) {
    return <div style={{ padding: '2rem', color: 'red' }}>❌ Trello context not available</div>;
  }

  return <MotivationDashboard trelloMemberId={trelloMemberId} />;
}

export default MotivationDashboardPage;
