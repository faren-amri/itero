import { useEffect, useState } from 'react';
import MotivationDashboard from '../components/MotivationDashboard/MotivationDashboard';

function MotivationDashboardPage() {
  const [context, setContext] = useState(null);

  useEffect(() => {
    async function loadTrelloArgs() {
      try {
        const t = window.TrelloPowerUp.iframe();
        const args = await t.args;
        const memberId = args?.member || null;

        if (memberId) {
          console.log('✅ Trello member ID resolved from iframe args:', memberId);
          setContext({ memberId });
        } else {
          console.warn('⚠️ Trello member ID NOT found in iframe args:', args);
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
