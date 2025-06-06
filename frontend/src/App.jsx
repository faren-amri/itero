import { Routes, Route, Navigate } from 'react-router-dom';
import MotivationDashboardPage from './pages/MotivationDashboardPage';
import TaskCompleteModal from './pages/TaskCompleteModal';
import './styles.css';

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<MotivationDashboardPage />} />
      <Route path="/task-complete" element={<TaskCompleteModal />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
