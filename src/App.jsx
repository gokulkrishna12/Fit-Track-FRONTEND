import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Auth from './pages/Auth/Auth';
import Dashboard from './pages/UserDashboard/Dashboard';
import Profile from './pages/Profile/Profile';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" replace />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;