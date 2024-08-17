import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import { ErrorProvider } from './contexts/ErrorContext';
import ErrorNotification from './components/ErrorNotification';

function App() {
  return (
    <ErrorProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </ErrorProvider>
  );
}

const ErrorNotificationWrapper = () => {
  const { error, showError } = useError();

  return <ErrorNotification message={error} onClose={() => showError(null)} />;
};

export default App
