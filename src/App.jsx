import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Performance Fix: Lazy loading the pages so they only load when needed
const Auth = lazy(() => import('./pages/Auth/Auth'));
const Dashboard = lazy(() => import('./pages/UserDashboard/Dashboard'));
const Profile = lazy(() => import('./pages/Profile/Profile'));

function App() {
  const { user } = useAuth();

  return (
    <Router>
      {/* Suspense handles the loading state while the lazy component is fetched */}
      <Suspense fallback={
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0D1321', color: '#38BDF8' }}>
          <h2>Loading FitTrack...</h2>
        </div>
      }>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" replace />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;