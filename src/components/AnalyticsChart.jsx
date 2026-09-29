// src/components/AnalyticsChart.jsx
import React from 'react';
import { useGetAnalyticsQuery } from '../store/apiSlice';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity } from 'lucide-react';

const AnalyticsChart = () => {
    const { data, isLoading, isError } = useGetAnalyticsQuery();

    if (isLoading) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#38BDF8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <Activity size={32} style={{ animation: 'spin 2s linear infinite' }} />
                <span>Loading Market Data...</span>
            </div>
        );
    }

    if (isError || !data?.data?.weeklyTrend || data.data.weeklyTrend.length === 0) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', background: 'rgba(30, 41, 59, 0.3)', borderRadius: '12px', border: '1px dashed #334155' }}>
                No trading volume detected yet. Hit the gym to start generating data!
            </div>
        );
    }

    const chartData = data.data.weeklyTrend.map(item => ({
        date: item._id,
        volume: item.dailyVolume
    }));

    return (
        <div style={{ width: '100%', height: 400, marginTop: '2rem' }}>
            <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        {/* The Trading App Gradient Effect */}
                        <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                        </linearGradient>
                    </defs>

                    {/* Techy Grid Lines */}
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />

                    <XAxis
                        dataKey="date"
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                    />
                    <YAxis
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}kg`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            border: '1px solid #06B6D4',
                            borderRadius: '8px',
                            color: '#fff',
                            boxShadow: '0 4px 20px rgba(6, 182, 212, 0.2)'
                        }}
                        itemStyle={{ color: '#06B6D4', fontWeight: 'bold' }}
                    />

                    {/* Smooth glowing line with gradient area */}
                    <Area
                        type="monotone"
                        dataKey="volume"
                        stroke="#06B6D4"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorVolume)"
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AnalyticsChart;