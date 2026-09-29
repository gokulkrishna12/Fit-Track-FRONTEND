// src/components/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    // Update state so the next render shows the fallback UI
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    // Catch the error and log it (In a real enterprise app, we'd send this to Sentry/Datadog)
    componentDidCatch(error, errorInfo) {
        console.error('🛡️ ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Sleek fallback UI matching your Glassmorphism dark theme
            return (
                <div style={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    alignItems: 'center', height: '100vh', backgroundColor: '#080C14',
                    color: '#FFFFFF', textAlign: 'center', padding: '2rem'
                }}>
                    <div style={{
                        background: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(10px)',
                        padding: '3rem', borderRadius: '16px', border: '1px solid rgba(248, 113, 113, 0.2)',
                        maxWidth: '400px'
                    }}>
                        <h2 style={{ color: '#F87171', fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <span>⚠️</span> Application Error
                        </h2>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: '1.5' }}>
                            We encountered an unexpected issue while loading this view. Please refresh the page to continue tracking your progress.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: '0.8rem 1.5rem', background: '#6366F1', color: '#FFFFFF',
                                border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
                                width: '100%', transition: 'background 0.2s ease'
                            }}
                            onMouseOver={(e) => e.target.style.background = '#4F46E5'}
                            onMouseOut={(e) => e.target.style.background = '#6366F1'}
                        >
                            Reload Fit-Track
                        </button>
                    </div>
                </div>
            );
        }

        // If there's no error, render the children normally
        return this.props.children;
    }
}

export default ErrorBoundary;