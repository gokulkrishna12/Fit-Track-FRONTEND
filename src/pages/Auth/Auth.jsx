import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, AlertCircle, Dumbbell, Flame, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../service/api';
import './Auth.scss';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;

        if (!emailRegex.test(formData.email)) {
            return setError('Please enter a valid email address.');
        }

        if (!passwordRegex.test(formData.password)) {
            return setError('Password must be at least 6 characters long and contain both letters and numbers.');
        }

        setLoading(true);

        try {
            let response;
            if (isLogin) {
                response = await API.post('/auth/login', {
                    email: formData.email,
                    password: formData.password
                });
            } else {
                response = await API.post('/auth/register', formData);
            }

            const { token, ...userData } = response.data;
            login(userData, token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-container"> {/* 👇 SEMANTIC FIX: Changed div to main */}
            <div className="auth-card">
                <div className="auth-brand">
                    <div className="brand-badge-box">
                        <Dumbbell size={28} className="dumbbell-logo" aria-hidden="true" />
                    </div>
                    <h2>FitTrack <span className="pro-pill">PRO</span></h2>
                    <div className="motto-badge">
                        <Flame size={13} className="flame-icon" aria-hidden="true" />
                        <span>LIGHT WEIGHT BABY</span>
                    </div>
                </div>

                <header className="auth-header">
                    <h1>{isLogin ? 'Athlete Login' : 'Join The Sanctuary'}</h1>
                    <p>{isLogin ? 'Enter your credentials to access your workout archives.' : 'Begin your journey to ultimate strength today.'}</p>
                </header>

                {error && (
                    <div className="error-message" role="alert">
                        <AlertCircle size={18} aria-hidden="true" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form" noValidate>
                    {!isLogin && (
                        <div className="input-group">
                            <UserIcon className="input-icon" size={19} aria-hidden="true" />
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name / Athlete Handle"
                                aria-label="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <Mail className="input-icon" size={19} aria-hidden="true" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            aria-label="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Lock className="input-icon" size={19} aria-hidden="true" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password (min 6 chars, 1 letter + 1 number)"
                            aria-label="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{ paddingRight: '3rem' }}
                        />
                        {/* 👇 A11Y FIX: Added aria-label & minimum 44px touch target 👇 */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            title={showPassword ? "Hide password" : "Show password"}
                            style={{
                                position: 'absolute',
                                right: '0.5rem',
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-dim, #64748b)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '10px',
                                minWidth: '44px',
                                minHeight: '44px',
                                transition: 'color 0.2s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-main, #fff)'}
                            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-dim, #64748b)'}
                        >
                            {showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
                        </button>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Entering Iron Sanctuary...' : (isLogin ? 'Sign In to Dashboard' : 'Create Athlete Account')}
                        {!loading && <ArrowRight size={19} aria-hidden="true" />}
                    </button>
                </form>

                <footer className="auth-footer">
                    <p>
                        {isLogin ? "New to FitTrack? " : "Already an athlete? "}
                        <button
                            type="button"
                            className="text-link-btn"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                                setFormData({ name: '', email: '', password: '' });
                                setShowPassword(false);
                            }}
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                color: 'var(--primary)',
                                cursor: 'pointer',
                                font: 'inherit',
                                textDecoration: 'underline'
                            }}
                        >
                            {isLogin ? 'Register now' : 'Sign in here'}
                        </button>
                    </p>
                </footer>
            </div>
        </main>
    );
};

export default Auth;