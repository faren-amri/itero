import { useEffect, useState } from 'react';
import MotivationDashboard from '../components/MotivationDashboard/MotivationDashboard';

function MotivationDashboardPage() {
  const [context, setContext] = useState(null);

  useEffect(() => {
    async function loadTrelloArgs() {
      try {
        const t = window.TrelloPowerUp.iframe();
        const args = await t.args;

        // Support for array structure returned by modal args
        const memberId =
          args?.[1]?.member?.id || // correct structure
          args?.[0]?.context?.member || // fallback
          null;

        if (memberId) {
          console.log('✅ Trello member ID resolved:', memberId);
          setContext({ memberId });
        } else {
          console.warn('⚠️ Could not resolve Trello member ID from args:', args);
        }
      } catch (err) {
        console.error('❌ Error retrieving Trello iframe args:', err);
      }
    }

    loadTrelloArgs();
  }, []);

  if (!context?.memberId) {
    return <div style={{ padding: '2rem', color: 'white' }}>Loading Trello context...</div>;
  }

  return <MotivationDashboard userId={context.memberId} />;
}

export default MotivationDashboardPage;
