import { Routes, Route, Navigate } from 'react-router-dom';
import MotivationDashboardPage from './pages/MotivationDashboardPage';

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<MotivationDashboardPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
