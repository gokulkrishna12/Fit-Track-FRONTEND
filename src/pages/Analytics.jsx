// src/pages/Analytics/Analytics.jsx
import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import AnalyticsChart from '../../components/AnalyticsChart';
import { TrendingUp, BarChart2 } from 'lucide-react';

const Analytics = () => {
    return (
        <div className="dashboard-layout" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0D1321' }}>
            <Sidebar />

            <main style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                <header style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#38BDF8', marginBottom: '0.5rem' }}>
                        <TrendingUp size={20} />
                        <span style={{ fontWeight: '600', letterSpacing: '1px', fontSize: '0.9rem' }}>PERFORMANCE METRICS</span>
                    </div>
                    <h1 style={{ color: '#fff', fontSize: '2.5rem', margin: 0 }}>Analytics Center</h1>
                    <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Track your daily iron volume like a pro trader.</p>
                </header>

                <div style={{
                    background: 'rgba(18, 24, 38, 0.6)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '16px',
                    padding: '2rem',
                    flex: 1
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <BarChart2 size={20} color="#06B6D4" />
                            7-Day Volume Trend
                        </h3>
                    </div>

                    <AnalyticsChart />
                </div>

                <Footer />
            </main>
        </div>
    );
};

export default Analytics;