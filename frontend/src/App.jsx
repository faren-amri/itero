import { Routes, Route, Navigate } from 'react-router-dom';
import MotivationDashboardPage from './pages/MotivationDashboardPage';

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<MotivationDashboardPage />} />
      {/* Catch-all: redirect any unmatched route to /dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
