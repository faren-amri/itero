import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MotivationDashboardPage from './pages/MotivationDashboardPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MotivationDashboardPage />} />
      <Route path="/dashboard" element={<MotivationDashboardPage />} />
    </Routes>
  );
};

export default App;
