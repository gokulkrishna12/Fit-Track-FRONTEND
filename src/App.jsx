import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { apiSlice } from './store/apiSlice';
import ErrorBoundary from './components/ErrorBoundary';

// 👇 PERFORMANCE FIX: Import Auth statically so it paints instantly!
import Auth from './pages/Auth/Auth';

// Keep the heavy pages lazy-loaded
const Dashboard = lazy(() => import('./pages/UserDashboard/Dashboard'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const Analytics = lazy(() => import('./pages/Analytics/Analytics'));

function App() {
  const { user } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) return;

    const socket = io('https://fit-track-backend-02ef.onrender.com');

    socket.on('connect', () => {
      const userId = user._id || user.id;
      socket.emit('join_room', userId);
    });

    socket.on('workout_updated', () => {
      console.log('⚡ Real-time update received! Refreshing dashboard analytics...');
      dispatch(apiSlice.util.invalidateTags(['Analytics']));
    });

    return () => {
      socket.disconnect();
    };
  }, [user, dispatch]);

  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0D1321', color: '#38BDF8' }}>
            <h2>Loading FitTrack...</h2>
          </div>
        }>
          <Routes>
            {/* The Auth page now loads immediately without Suspense delays */}
            <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />

            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" replace />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" replace />} />
            <Route path="/analytics" element={user ? <Analytics /> : <Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;