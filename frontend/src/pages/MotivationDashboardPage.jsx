import { useEffect, useState } from 'react';
import MotivationDashboard from '../components/MotivationDashboard/MotivationDashboard';
import { getTrelloArgsSafe } from '../services/trelloContext';

function MotivationDashboardPage() {
  const [trelloMemberId, setTrelloMemberId] = useState(null);

  useEffect(() => {
    (async () => {
      const { member } = await getTrelloArgsSafe(); // ← here
      if (member) setTrelloMemberId(member);
    })();
  }, []);

  if (!trelloMemberId) {
    return <div style={{ padding: '2rem', color: 'white' }}>Loading…</div>;
  }

  return <MotivationDashboard trelloMemberId={trelloMemberId} />;
}

export default MotivationDashboardPage;
