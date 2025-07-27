import { useEffect, useState } from 'react';
import MotivationDashboard from '../components/MotivationDashboard/MotivationDashboard';

function MotivationDashboardPage() {
  const [context, setContext] = useState(null);

  useEffect(() => {
    const t = window.TrelloPowerUp.iframe();
    const args = t.args || {};
    const memberId = args?.member || null;


    if (memberId) {
      console.log('✅ Resolved Trello member ID:', memberId);
      setContext({ memberId });
    } else {
      console.warn('⚠️ Trello member ID not found in iframe args.');
    }
  }, []);

  if (!context?.memberId) {
    return <div style={{ padding: '2rem', color: 'white' }}>Loading Trello context...</div>;
  }

  return <MotivationDashboard userId={context.memberId} />;
}

export default MotivationDashboardPage;
