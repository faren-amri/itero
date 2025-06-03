import { Routes, Route, Navigate } from 'react-router-dom';
import MotivationDashboardPage from './pages/MotivationDashboardPage';
import TaskCompleteModal from './pages/TaskCompleteModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <Routes>

        <Route path="/dashboard" element={<MotivationDashboardPage />} />
        <Route path="/task-complete" element={<TaskCompleteModal />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </>
  );
}

export default App;
