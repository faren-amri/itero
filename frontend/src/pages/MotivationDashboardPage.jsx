import { useEffect, useState } from 'react';
import MotivationDashboard from '../components/MotivationDashboard/MotivationDashboard';

function MotivationDashboardPage() {
  const [context, setContext] = useState(null);

  useEffect(() => {
  const t = window.TrelloPowerUp.iframe();

  const loadContext = async () => {
    await t.render(); // ✅ wait for Trello to inject args

    const args = await t.arg('member'); // ← Trello guarantees this resolves correctly
    const memberId = args || null;

    console.log('Resolved Trello member ID:', memberId);
    setContext({ memberId });
  };

  loadContext();
}, []);


  if (!context?.memberId) {
    return <div style={{ padding: '2rem', color: 'white' }}>Loading Trello context...</div>;
  }

  return <MotivationDashboard userId={context.memberId} />;
}

export default MotivationDashboardPage;
