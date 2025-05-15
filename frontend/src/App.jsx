import { HashRouter, Routes, Route } from 'react-router-dom';
import MotivationDashboardPage from './pages/MotivationDashboardPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/dashboard" element={<MotivationDashboardPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
