import { useEffect, useState } from 'react';
import MotivationDashboard from '../components/MotivationDashboard/MotivationDashboard';

function MotivationDashboardPage() {
  const [context, setContext] = useState(null);

  useEffect(() => {
    const t = window.TrelloPowerUp.iframe();

    t.get('args').then((args) => {
      const memberId = args?.member;
      console.log('Resolved Trello member ID:', memberId);
      setContext({ memberId });
    }).catch((err) => {
      console.error('Failed to get Trello args:', err);
    });
  }, []);

  if (!context?.memberId) {
    return <div style={{ padding: '2rem', color: 'white' }}>Loading Trello context...</div>;
  }

  return <MotivationDashboard userId={context.memberId} />;
}

export default MotivationDashboardPage;
