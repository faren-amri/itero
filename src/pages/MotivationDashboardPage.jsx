import React from 'react';
import MotivationDashboard from '../components/MotivationDashboard/MotivationDashboard';

const MotivationDashboardPage = () => {
  const userId = JSON.parse(localStorage.getItem('user'))?.id;

  return <MotivationDashboard userId={userId} />;
};

export default MotivationDashboardPage;
