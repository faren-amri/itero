import { useEffect, useState } from 'react';

function MotivationDashboardPage() {
  const [context, setContext] = useState({});

  useEffect(() => {
    const t = window.TrelloPowerUp.iframe(); // Initialize iframe context

    const fetchArgs = async () => {
      try {
        const card = await t.arg('card');
        const member = await t.arg('member');
        const secret = await t.arg('secret');
        setContext({ card, member, secret });
        console.log('Trello Context:', { card, member, secret });
      } catch (error) {
        console.error('Failed to load Trello context:', error);
      }
    };

    fetchArgs();
  }, []);

  return (
    <div style={{ padding: '2rem', color: 'white', background: '#1c1c1c' }}>
      <h1>Itero Motivation Dashboard</h1>
      <p>This modal was opened from Trello.</p>
      <h2>Context Data:</h2>
      <pre style={{ background: '#2b2b2b', padding: '1rem' }}>
        {JSON.stringify(context, null, 2)}
      </pre>
    </div>
  );
}

export default MotivationDashboardPage;
