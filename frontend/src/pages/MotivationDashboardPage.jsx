import React from 'react';
import MotivationDashboard from '../components/MotivationDashboard/MotivationDashboard';

const MotivationDashboardPage = () => {
  let userId = null;

  try {
    userId = JSON.parse(localStorage.getItem('user'))?.id || null;
  } catch (e) {
    console.warn("Failed to read user from localStorage:", e);
  }

  return (
    <div style={{ padding: '2rem', color: 'white' }}>
      {userId ? (
        <MotivationDashboard userId={userId} />
      ) : (
        <div>⚠️ No user found. Dashboard cannot load.</div>
      )}
    </div>
  );
};

export default MotivationDashboardPage;
