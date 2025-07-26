import { useEffect, useState } from 'react';
import MotivationDashboard from '../components/MotivationDashboard/MotivationDashboard';

function MotivationDashboardPage() {
  const [context, setContext] = useState(null);

  useEffect(() => {
    const t = window.TrelloPowerUp.iframe();
    const args = t.args || {};
    const memberId = args?.context?.member || args?.member || null;
    setContext({ memberId });
    console.log('Resolved Trello member ID:', memberId);
  }, []);

  if (!context?.memberId) return <div style={{ padding: '2rem', color: 'white' }}>Loading Trello context...</div>;

    return (
      <MotivationDashboard userId={context.memberId} />
    );
  }

export default MotivationDashboardPage;
