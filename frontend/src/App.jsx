import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MotivationDashboardPage from './pages/MotivationDashboardPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<div>Welcome to Itero Power-Up</div>} />
      <Route path="/dashboard" element={<MotivationDashboardPage />} />
    </Routes>
  );
};

export default App;
