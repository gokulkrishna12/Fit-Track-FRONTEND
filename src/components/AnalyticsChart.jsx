// src/components/AnalyticsChart.jsx
import React from 'react';
import { useGetAnalyticsQuery } from '../store/apiSlice';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AnalyticsChart = () => {
    // RTK Query handles the fetch, caching, and loading state automatically!
    const { data, isLoading, isError, error } = useGetAnalyticsQuery();

    if (isLoading) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted, #94a3b8)' }}>
                Loading Analytics...
            </div>
        );
    }

    // 👇 WE REMOVED "return null" SO WE CAN SEE THE ACTUAL ERROR 👇
    if (isError) {
        console.error("Analytics Fetch Error:", error);
        return (
            <div style={{
                padding: '2rem', textAlign: 'center', color: '#EF4444',
                background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px', marginBottom: '2rem'
            }}>
                <strong>Backend API Error:</strong> The frontend cannot reach the /analytics endpoint.
                <br />
                <em>(Check your Render dashboard to make sure the backend successfully deployed the latest commit!)</em>
            </div>
        );
    }

    const weeklyData = data?.data?.weeklyTrend;

    // 👇 SHOW A MESSAGE IF NO DATA INSTEAD OF HIDING 👇
    if (!weeklyData || weeklyData.length === 0) {
        return (
            <div style={{
                padding: '2rem', textAlign: 'center', color: '#F59E0B',
                background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '12px', marginBottom: '2rem'
            }}>
                No workout volume found for the past 7 days to generate the chart. Log a new workout below!
            </div>
        );
    }

    const chartData = weeklyData.map(item => ({
        date: item._id,
        volume: item.dailyVolume
    }));

    return (
        <div style={{
            background: 'rgba(18, 24, 38, 0.85)',
            backdropFilter: 'blur(20px)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '2rem',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
        }}>
            <h3 style={{
                color: '#FFFFFF',
                marginBottom: '1.5rem',
                fontSize: '1.2rem',
                fontWeight: '600'
            }}>
                🔥 Weekly Volume Trend
            </h3>

            <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                    <BarChart data={chartData}>
                        <XAxis
                            dataKey="date"
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}kg`}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                            contentStyle={{
                                backgroundColor: '#0f172a',
                                border: '1px solid #334155',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                        />
                        <Bar
                            dataKey="volume"
                            fill="#6366F1"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AnalyticsChart;