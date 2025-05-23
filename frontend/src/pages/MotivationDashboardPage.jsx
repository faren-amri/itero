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

  if (!context || !context.member) {
    return (
      <div style={{ padding: '2rem', color: 'white', background: '#1c1c1c' }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', color: 'white', background: '#1c1c1c' }}>
      <h1>Itero Motivation Dashboard</h1>
      <MotivationDashboard userId={context.member} />
      <h2>Context Data:</h2>
      <pre style={{ background: '#2b2b2b', padding: '1rem' }}>
        {JSON.stringify(context, null, 2)}
      </pre>
    </div>
  );
}

export default MotivationDashboardPage;
