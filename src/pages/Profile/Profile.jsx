import React, { useState, useEffect, useMemo } from 'react';
import {
    User, Mail, Calendar, Dumbbell, Activity, Scale, Trophy,
    Search, Filter, ArrowUpDown, ChevronDown, ChevronUp, Trash2,
    Flame, Sparkles, X, Layers, Clock, AlertCircle, Edit2, Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../service/api';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import './Profile.scss';

const Profile = () => {
    const { user } = useAuth();
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date-desc');

    // Expanded dates state
    const [expandedDates, setExpandedDates] = useState({});

    // Editing states
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ exerciseName: '', sets: '', reps: '', weight: '', date: '' });

    // Fetch user workouts on component load
    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const response = await API.get('/workouts');
                setWorkouts(response.data);

                const initialExpanded = {};
                response.data.forEach(w => {
                    if (w.date) initialExpanded[w.date] = true;
                });
                setExpandedDates(initialExpanded);
            } catch (err) {
                setError('Failed to load workout history.');
            } finally {
                setLoading(false);
            }
        };

        fetchWorkouts();
    }, []);

    // Delete workout action with Confirmation
    const handleDeleteWorkout = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this workout? This action cannot be undone.");
        if (!isConfirmed) return;

        try {
            await API.delete(`/workouts/${id}`);
            setWorkouts(prev => prev.filter(w => w._id !== id));
        } catch (err) {
            alert('Failed to delete workout.');
        }
    };

    // Edit Actions
    const handleEditClick = (workout) => {
        setEditingId(workout._id);
        setEditForm({
            exerciseName: workout.exerciseName,
            sets: workout.sets,
            reps: workout.reps,
            weight: workout.weight,
            date: workout.date
        });
    };

    const handleUpdateSubmit = async (id) => {
        try {
            const response = await API.put(`/workouts/${id}`, editForm);
            setWorkouts(prev => prev.map(w => (w._id === id ? response.data : w)));
            setEditingId(null);
        } catch (err) {
            alert('Failed to update workout');
        }
    };

    // Toggle date expansion
    const toggleDateExpand = (date) => {
        setExpandedDates(prev => ({
            ...prev,
            [date]: !prev[date]
        }));
    };

    const toggleExpandAll = (expand) => {
        const updated = {};
        workouts.forEach(w => {
            if (w.date) updated[w.date] = expand;
        });
        setExpandedDates(updated);
    };

    // Format helper for display dates
    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return 'Unspecified Date';
        try {
            const dateObj = new Date(dateStr + 'T00:00:00');
            const today = new Date().toISOString().split('T')[0];
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

            let tag = '';
            if (dateStr === today) tag = 'Today';
            else if (dateStr === yesterday) tag = 'Yesterday';

            const formatted = dateObj.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });

            return { formatted, tag };
        } catch (e) {
            return { formatted: dateStr, tag: '' };
        }
    };

    const memberSinceDate = useMemo(() => {
        if (user?.createdAt) {
            return new Date(user.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
            });
        }
        return 'Pro Founding Athlete';
    }, [user]);

    const stats = useMemo(() => {
        const totalWorkouts = workouts.length;
        let totalVolumeKg = 0;
        let totalReps = 0;
        const uniqueDates = new Set();

        workouts.forEach(w => {
            const sets = Number(w.sets) || 1;
            const reps = Number(w.reps) || 0;
            const weight = Number(w.weight) || 0;

            totalVolumeKg += (sets * reps * weight);
            totalReps += (sets * reps);
            if (w.date) uniqueDates.add(w.date);
        });

        return {
            totalWorkouts,
            totalVolumeKg: Math.round(totalVolumeKg),
            totalReps,
            activeDays: uniqueDates.size
        };
    }, [workouts]);

    const filteredWorkouts = useMemo(() => {
        return workouts.filter(w => {
            const matchesSearch = !searchQuery.trim() ||
                (w.exerciseName && w.exerciseName.toLowerCase().includes(searchQuery.toLowerCase().trim()));

            if (!matchesSearch) return false;

            if (dateFilter !== 'all' && w.date) {
                const workoutDate = new Date(w.date + 'T00:00:00');
                const now = new Date();

                if (dateFilter === '7days') {
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(now.getDate() - 7);
                    if (workoutDate < sevenDaysAgo) return false;
                } else if (dateFilter === '30days') {
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(now.getDate() - 30);
                    if (workoutDate < thirtyDaysAgo) return false;
                } else if (dateFilter === 'thisMonth') {
                    if (workoutDate.getMonth() !== now.getMonth() || workoutDate.getFullYear() !== now.getFullYear()) {
                        return false;
                    }
                }
            }
            return true;
        }).sort((a, b) => {
            if (sortBy === 'date-desc') return new Date(b.date || 0) - new Date(a.date || 0);
            if (sortBy === 'date-asc') return new Date(a.date || 0) - new Date(b.date || 0);
            if (sortBy === 'weight-desc') return (Number(b.weight) || 0) - (Number(a.weight) || 0);
            if (sortBy === 'reps-desc') return ((Number(b.sets) || 1) * (Number(b.reps) || 0)) - ((Number(a.sets) || 1) * (Number(a.reps) || 0));
            return 0;
        });
    }, [workouts, searchQuery, dateFilter, sortBy]);

    const groupedByDate = useMemo(() => {
        const groups = {};
        filteredWorkouts.forEach(w => {
            const dateKey = w.date || 'Unspecified';
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(w);
        });
        return groups;
    }, [filteredWorkouts]);

    const dateKeys = Object.keys(groupedByDate);
    const hasActiveFilters = searchQuery !== '' || dateFilter !== 'all' || sortBy !== 'date-desc';

    return (
        <div className="profile-layout">
            <Sidebar />

            <main className="profile-main-content">
                <div className="profile-header-banner">
                    <div className="user-hero-card">
                        <div className="hero-avatar-wrapper">
                            <div className="hero-avatar">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <div className="pro-badge">PRO</div>
                        </div>

                        <div className="hero-details">
                            <div className="name-row">
                                <h1>{user?.name || 'Gokul Krishna'}</h1>
                                <span className="hardcore-pill">
                                    <Flame size={14} /> IRON WARRIOR
                                </span>
                            </div>

                            <div className="user-meta-items">
                                <div className="meta-item">
                                    <Mail size={15} />
                                    <span>{user?.email || 'athlete@fittrack.com'}</span>
                                </div>
                                <div className="meta-item">
                                    <Calendar size={15} />
                                    <span>Joined {memberSinceDate}</span>
                                </div>
                                <div className="meta-item status-pill">
                                    <Sparkles size={14} />
                                    <span>Active Athlete</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="profile-stats-section">
                    <div className="stat-card stat-workouts">
                        <div className="stat-icon-box"><Dumbbell size={24} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Total Workouts</span>
                            <h3 className="stat-value">{stats.totalWorkouts}</h3>
                            <span className="stat-subtext">Logged sessions</span>
                        </div>
                    </div>
                    <div className="stat-card stat-volume">
                        <div className="stat-icon-box"><Scale size={24} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Total Volume Lifted</span>
                            <h3 className="stat-value">{stats.totalVolumeKg.toLocaleString()} <span className="unit">kg</span></h3>
                            <span className="stat-subtext">Cumulative workload</span>
                        </div>
                    </div>
                    <div className="stat-card stat-reps">
                        <div className="stat-icon-box"><Activity size={24} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Total Reps Crushed</span>
                            <h3 className="stat-value">{stats.totalReps.toLocaleString()}</h3>
                            <span className="stat-subtext">Repetitions completed</span>
                        </div>
                    </div>
                    <div className="stat-card stat-days">
                        <div className="stat-icon-box"><Trophy size={24} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Active Training Days</span>
                            <h3 className="stat-value">{stats.activeDays}</h3>
                            <span className="stat-subtext">Dedicated gym days</span>
                        </div>
                    </div>
                </section>

                <section className="tracker-section">
                    <div className="section-title-row">
                        <div className="title-group">
                            <div className="icon-badge"><Layers size={20} /></div>
                            <div>
                                <h2>Date-Wise Workout Tracker</h2>
                                <p>Search, filter, and inspect your workout history grouped by day</p>
                            </div>
                        </div>

                        {dateKeys.length > 0 && (
                            <div className="expand-controls">
                                <button className="control-btn" onClick={() => toggleExpandAll(true)}>Expand All</button>
                                <button className="control-btn" onClick={() => toggleExpandAll(false)}>Collapse All</button>
                            </div>
                        )}
                    </div>

                    <div className="filters-toolbar">
                        <div className="search-input-box">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search by exercise (e.g. Bench Press)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button className="clear-search-btn" onClick={() => setSearchQuery('')}><X size={16} /></button>
                            )}
                        </div>

                        <div className="filter-dropdown-box">
                            <Filter size={16} className="filter-icon" />
                            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                                <option value="all">All Dates</option>
                                <option value="7days">Last 7 Days</option>
                                <option value="30days">Last 30 Days</option>
                                <option value="thisMonth">This Month</option>
                            </select>
                        </div>

                        <div className="filter-dropdown-box">
                            <ArrowUpDown size={16} className="filter-icon" />
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="date-desc">Newest Date First</option>
                                <option value="date-asc">Oldest Date First</option>
                                <option value="weight-desc">Heaviest Weight First</option>
                                <option value="reps-desc">Most Reps Crushed</option>
                            </select>
                        </div>

                        {hasActiveFilters && (
                            <button
                                className="reset-filters-btn"
                                onClick={() => { setSearchQuery(''); setDateFilter('all'); setSortBy('date-desc'); }}
                            >
                                <X size={15} /> Reset Filters
                            </button>
                        )}
                    </div>

                    <div className="results-indicator">
                        <span>
                            Showing <strong>{filteredWorkouts.length}</strong> workout{filteredWorkouts.length !== 1 ? 's' : ''} across <strong>{dateKeys.length}</strong> day{dateKeys.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {loading && (
                        <div className="tracker-loading-state">
                            <Activity size={32} className="spin-icon" />
                            <p>Loading your training archives...</p>
                        </div>
                    )}

                    {error && (
                        <div className="tracker-error-state">
                            <AlertCircle size={24} />
                            <p>{error}</p>
                        </div>
                    )}

                    {!loading && !error && dateKeys.length === 0 && (
                        <div className="tracker-empty-state">
                            <Dumbbell size={48} className="empty-icon" />
                            {hasActiveFilters ? (
                                <>
                                    <h3>No workouts matching your filters</h3>
                                    <p>Try searching for a different exercise name or reset your date filters.</p>
                                    <button
                                        className="reset-pill-btn"
                                        onClick={() => { setSearchQuery(''); setDateFilter('all'); setSortBy('date-desc'); }}
                                    >
                                        Clear All Filters
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h3>No workout history yet</h3>
                                    <p>Head to the Dashboard to log your first workout session! 🚀</p>
                                </>
                            )}
                        </div>
                    )}

                    {!loading && !error && dateKeys.length > 0 && (
                        <div className="date-groups-container">
                            {dateKeys.map(dateKey => {
                                const dayWorkouts = groupedByDate[dateKey];
                                const isExpanded = expandedDates[dateKey] ?? true;
                                const { formatted, tag } = formatDisplayDate(dateKey);

                                const dayTotalVolume = dayWorkouts.reduce((acc, curr) => {
                                    return acc + ((Number(curr.sets) || 1) * (Number(curr.reps) || 0) * (Number(curr.weight) || 0));
                                }, 0);

                                return (
                                    <div className={`date-group-card ${isExpanded ? 'is-expanded' : 'is-collapsed'}`} key={dateKey}>
                                        <div className="date-group-header" onClick={() => toggleDateExpand(dateKey)}>
                                            <div className="date-title-col">
                                                <div className="date-icon-circle"><Calendar size={18} /></div>
                                                <div className="date-text-wrapper">
                                                    <div className="date-main-line">
                                                        <h4>{formatted}</h4>
                                                        {tag && <span className="day-tag">{tag}</span>}
                                                    </div>
                                                    <span className="date-sub-info">
                                                        {dayWorkouts.length} exercise{dayWorkouts.length !== 1 ? 's' : ''} logged
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="date-meta-col">
                                                <div className="day-volume-pill">
                                                    <Scale size={14} />
                                                    <span>{dayTotalVolume.toLocaleString()} kg moved</span>
                                                </div>
                                                <div className="expand-chevron">
                                                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                </div>
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="date-workouts-body">
                                                <div className="date-workouts-grid">
                                                    {dayWorkouts.map(workout => (
                                                        <div className="detailed-workout-card" key={workout._id}>
                                                            {editingId === workout._id ? (
                                                                <div className="edit-form-container">
                                                                    <input
                                                                        type="text"
                                                                        value={editForm.exerciseName}
                                                                        onChange={(e) => setEditForm({ ...editForm, exerciseName: e.target.value })}
                                                                        className="edit-input"
                                                                        placeholder="Exercise Name"
                                                                    />
                                                                    <div className="edit-row-inputs">
                                                                        <input
                                                                            type="number"
                                                                            value={editForm.sets}
                                                                            onChange={(e) => setEditForm({ ...editForm, sets: e.target.value })}
                                                                            placeholder="Sets"
                                                                            className="edit-input"
                                                                        />
                                                                        <input
                                                                            type="number"
                                                                            value={editForm.reps}
                                                                            onChange={(e) => setEditForm({ ...editForm, reps: e.target.value })}
                                                                            placeholder="Reps"
                                                                            className="edit-input"
                                                                        />
                                                                        <input
                                                                            type="number"
                                                                            value={editForm.weight}
                                                                            onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
                                                                            placeholder="Weight"
                                                                            className="edit-input"
                                                                        />
                                                                    </div>
                                                                    <input
                                                                        type="text"
                                                                        value={editForm.date}
                                                                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                                                                        className="edit-input"
                                                                        placeholder="Date"
                                                                    />
                                                                    <div className="edit-actions">
                                                                        <button className="save-btn" onClick={() => handleUpdateSubmit(workout._id)}>
                                                                            <Check size={16} /> Save
                                                                        </button>
                                                                        <button className="cancel-btn" onClick={() => setEditingId(null)}>
                                                                            <X size={16} /> Cancel
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <div className="card-top">
                                                                        <div className="exercise-identity">
                                                                            <div className="dumbbell-icon-box"><Dumbbell size={18} /></div>
                                                                            <h5>{workout.exerciseName}</h5>
                                                                        </div>
                                                                        <div className="card-actions">
                                                                            <button className="icon-btn edit-btn" onClick={() => handleEditClick(workout)} title="Edit">
                                                                                <Edit2 size={15} />
                                                                            </button>
                                                                            <button className="icon-btn delete-btn" onClick={() => handleDeleteWorkout(workout._id)} title="Delete">
                                                                                <Trash2 size={15} />
                                                                            </button>
                                                                        </div>
                                                                    </div>

                                                                    <div className="stats-metric-row">
                                                                        <div className="metric-chip">
                                                                            <span className="chip-label">SETS</span>
                                                                            <strong className="chip-val">{workout.sets}</strong>
                                                                        </div>
                                                                        <div className="metric-chip">
                                                                            <span className="chip-label">REPS</span>
                                                                            <strong className="chip-val">{workout.reps}</strong>
                                                                        </div>
                                                                        <div className="metric-chip">
                                                                            <span className="chip-label">WEIGHT</span>
                                                                            <strong className="chip-val highlight">{workout.weight} kg</strong>
                                                                        </div>
                                                                    </div>

                                                                    <div className="card-bottom-bar">
                                                                        <span className="volume-summary">
                                                                            Total Volume: <strong>{((Number(workout.sets) || 1) * (Number(workout.reps) || 0) * (Number(workout.weight) || 0)).toLocaleString()} kg</strong>
                                                                        </span>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                <Footer />
            </main>
        </div>
    );
};

export default Profile;