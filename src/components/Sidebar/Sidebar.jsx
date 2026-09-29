import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, LogOut, Dumbbell, Flame, Sparkles, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.scss';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <aside className="app-sidebar">
            {/* Brand Header */}
            <div className="sidebar-brand">
                <div className="brand-logo-container">
                    <div className="logo-icon-wrapper">
                        <Dumbbell className="brand-icon" size={26} />
                    </div>
                    <div className="brand-text">
                        <h2>FitTrack</h2>
                        <span className="brand-tag">PRO GYM</span>
                    </div>
                </div>

                {/* Hardcore Gym Slogan Pill */}
                <div className="slogan-pill">
                    <Flame size={14} className="slogan-icon" />
                    <span>LIGHT WEIGHT BABY</span>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="sidebar-nav">
                <div className="nav-section-label">MAIN NAVIGATION</div>

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                    <div className="link-icon-box">
                        <LayoutDashboard size={20} />
                    </div>
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/profile"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                    <div className="link-icon-box">
                        <User size={20} />
                    </div>
                    <span>Profile & History</span>
                </NavLink>

                {/* 👇 NEW ANALYTICS BUTTON 👇 */}
                <NavLink
                    to="/analytics"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                    <div className="link-icon-box">
                        <TrendingUp size={20} />
                    </div>
                    <span>Analytics</span>
                </NavLink>
            </nav>

            {/* User Quick Info & Logout Footer */}
            <div className="sidebar-footer">
                <div className="user-profile-preview">
                    <div className="user-avatar-mini">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div className="user-info-text">
                        <span className="user-name">{user?.name || 'Athlete'}</span>
                        <span className="user-status">
                            <Sparkles size={11} /> Pro Member
                        </span>
                    </div>
                </div>

                <button className="sidebar-logout-btn" onClick={handleLogout} title="Log out">
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;