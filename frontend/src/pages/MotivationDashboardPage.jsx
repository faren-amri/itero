import { useEffect, useState } from 'react';

function MotivationDashboardPage() {
  const [context, setContext] = useState({});

  useEffect(() => {
    const t = window.TrelloPowerUp.iframe();

    const args = t.args || {}; // ✅ Pull context from t.args directly
    console.log('Trello Context:', args);
    setContext(args);
  }, []);

  return (
    <div style={{ padding: '2rem', color: 'white', background: '#1c1c1c', minHeight: '100vh' }}>
      <h1>Itero Motivation Dashboard</h1>
      <p>This modal was opened from Trello.</p>
      <h2>Context Data:</h2>
      <pre style={{ background: '#2b2b2b', padding: '1rem', borderRadius: '0.5rem' }}>
        {JSON.stringify(context, null, 2)}
      </pre>
    </div>
  );
}

export default MotivationDashboardPage;
