import { useEffect, useState } from 'react';
import MotivationDashboard from '../components/MotivationDashboard/MotivationDashboard';

function MotivationDashboardPage() {
  const [memberId, setMemberId] = useState(null);

  useEffect(() => {
    const t = window.TrelloPowerUp.iframe();

    const loadMember = async () => {
      try {
        const member = await t.arg('member');
        console.log('✅ Resolved Trello member ID:', member);
        setMemberId(member);
      } catch (err) {
        console.error('❌ Failed to get member ID:', err);
      }
    };

    loadMember();
  }, []);

  if (!memberId) {
    return <div style={{ padding: '2rem', color: 'white' }}>Loading Trello context...</div>;
  }

  return <MotivationDashboard userId={memberId} />;
}

export default MotivationDashboardPage;
