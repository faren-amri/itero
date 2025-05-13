import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import MotivationDashboardPage from './pages/MotivationDashboardPage';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<div>Welcome to Itero Power-Up</div>} />
        <Route path="/dashboard" element={<MotivationDashboardPage />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
