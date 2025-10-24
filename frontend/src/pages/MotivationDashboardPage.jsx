import { useEffect, useState } from 'react';
import MotivationDashboard from '../components/MotivationDashboard/MotivationDashboard';
import { getTrelloArgsSafe } from '../services/trelloContext';

function MotivationDashboardPage() {
  const [trelloMemberId, setTrelloMemberId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => !cancelled && setSlow(true), 5000); // show hint if slow

    (async () => {
      const { member } = await getTrelloArgsSafe();
      if (!cancelled && member) setTrelloMemberId(member);
      if (!cancelled) setLoading(false);
    })();

    return () => { cancelled = true; clearTimeout(timer); };
  }, []);

  if (loading) {
    return (
      <div style={{
        padding: '2rem',
        color: 'var(--text-main)',
        fontFamily: 'inherit'
      }}>
        <div style={{opacity:.85}}>Loading Itero…</div>
        {slow && <div style={{marginTop:8, color:'var(--text-muted)'}}>
          If this takes longer than usual, ensure Trello is injecting context and your network is reachable.
        </div>}
      </div>
    );
  }

  if (!trelloMemberId) {
    return (
      <div style={{ padding: '2rem', color: 'var(--danger)' }}>
        ❌ Trello context not available
      </div>
    );
  }

  return <MotivationDashboard trelloMemberId={trelloMemberId} />;
}

export default MotivationDashboardPage;
