import { Routes, Route } from 'react-router-dom';
import MotivationDashboardPage from './pages/MotivationDashboardPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MotivationDashboardPage />} />
    </Routes>
  );
}

export default App;
