import { useEffect, useState } from 'react';
import MotivationDashboard from '../components/MotivationDashboard/MotivationDashboard';

function MotivationDashboardPage() {
  const [context, setContext] = useState(null);

  useEffect(() => {
    const t = window.TrelloPowerUp.iframe();
    const args = t.args || {};
    setContext(args);
    console.log('Trello Context:', args);
  }, []);

  if (!context) return <div style={{ padding: '2rem', color: 'white' }}>Loading...</div>;

  return (
    <MotivationDashboard userId={context.member} />
  );
}

export default MotivationDashboardPage;
