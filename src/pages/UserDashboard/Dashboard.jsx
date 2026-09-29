import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Flame, Dumbbell, Sparkles, TrendingUp } from 'lucide-react';
import WorkoutForm from '../../components/WorkoutForm/WorkoutForm';
import WorkoutList from '../../components/WorkoutList/WorkoutList';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import './Dashboard.scss';


const Dashboard = () => {
    const { user } = useAuth();
    const [workouts, setWorkouts] = useState([]);

    const handleWorkoutAdded = (newWorkout) => {
        setWorkouts([newWorkout, ...workouts]);
    };

    const AnalyticsChart = lazy(() => import('../../components/AnalyticsChart'));

    return (
        <div className="dashboard-layout">
            {/* Modular Gym Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="dashboard-main-content">
                {/* Analytics Chart Section */}
                <Suspense fallback={<div style={{ color: '#94a3b8', padding: '1rem' }}>Loading Charts...</div>}>
                    <AnalyticsChart />
                </Suspense>

                {/* Header Banner */}
                <header className="dashboard-header">
                    <div className="header-greeting">
                        <div className="athlete-tag">
                            <Sparkles size={14} className="tag-sparkle" />
                            <span>WELCOME ATHLETE</span>
                        </div>
                        <h1>Welcome back, <span className="highlight-name">{user?.name || 'Athlete'}</span>! 💪</h1>
                        <p>Track every rep, crush your personal records, and build your legacy.</p>
                    </div>

                    <div className="header-motivation-pill">
                        <Flame size={16} className="flame-icon" />
                        <div className="pill-text">
                            <strong>TODAY'S MOTTO</strong>
                            <span>"Ain't nothing to it but to do it!"</span>
                        </div>
                    </div>
                </header>

                {/* Workspace - Workout Form & Workout List */}
                <div className="dashboard-workspace">
                    <WorkoutForm onWorkoutAdded={handleWorkoutAdded} />
                    <WorkoutList workouts={workouts} setWorkouts={setWorkouts} />
                </div>

                {/* Developer Footer */}
                <Footer />
            </main>
        </div>
    );
};

export default Dashboard;