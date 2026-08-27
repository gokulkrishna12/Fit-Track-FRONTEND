import React, { useEffect, useState } from 'react';
import { Trash2, Calendar, Dumbbell, Activity, ExternalLink, Scale, Edit2, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../service/api';
import './WorkoutList.scss';

const WorkoutList = ({ workouts, setWorkouts }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Editing states
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ exerciseName: '', sets: '', reps: '', weight: '', date: '' });

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const response = await API.get('/workouts');
                setWorkouts(response.data);
            } catch (err) {
                setError('Failed to load workouts from server.');
            } finally {
                setLoading(false);
            }
        };
        fetchWorkouts();
    }, [setWorkouts]);

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this workout? This action cannot be undone.");
        if (!isConfirmed) {
            return;
        }

        try {
            await API.delete(`/workouts/${id}`);
            setWorkouts(workouts.filter((workout) => workout._id !== id));
        } catch (err) {
            alert('Failed to delete workout');
        }
    };

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
            setWorkouts(workouts.map((w) => (w._id === id ? response.data : w)));
            setEditingId(null);
        } catch (err) {
            alert('Failed to update workout');
        }
    };

    if (loading) {
        return (
            <div className="workout-list-container">
                <div className="loading-state-card">
                    <Activity size={32} className="spin-icon" />
                    <p>Loading your iron history...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="workout-list-container">
                <div className="error-state-card">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (workouts.length === 0) {
        return (
            <div className="workout-list-container">
                <div className="empty-workouts-card">
                    <div className="empty-icon-circle">
                        <Dumbbell size={36} />
                    </div>
                    <h3>No Workouts Logged Yet</h3>
                    <p>Every champion starts with rep one. Log your first exercise above! 💪</p>
                </div>
            </div>
        );
    }

    return (
        <div className="workout-list-container">
            <div className="list-header-row">
                <div className="list-title-box">
                    <Dumbbell size={22} className="title-icon" />
                    <div>
                        <h3>Recent Workout Feed</h3>
                        <span className="subtitle">Showing your latest training sessions</span>
                    </div>
                </div>

                <Link to="/profile" className="view-all-link">
                    <span>View Date-Wise Tracker</span>
                    <ExternalLink size={15} />
                </Link>
            </div>

            <div className="workout-grid">
                {workouts.map((workout) => {
                    const isEditing = editingId === workout._id;

                    return (
                        <div className="workout-card" key={workout._id}>
                            {isEditing ? (
                                <div className="edit-form-container">
                                    <h4 className="edit-title">Update Workout</h4>
                                    <input
                                        type="text"
                                        value={editForm.exerciseName}
                                        onChange={(e) => setEditForm({ ...editForm, exerciseName: e.target.value })}
                                        className="edit-input"
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
                                    <div className="card-header">
                                        <div className="exercise-title">
                                            <div className="exercise-icon-box">
                                                <Dumbbell size={18} />
                                            </div>
                                            <h4>{workout.exerciseName}</h4>
                                        </div>

                                        <div className="card-actions">
                                            <button
                                                className="icon-btn edit-btn"
                                                onClick={() => handleEditClick(workout)}
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                className="icon-btn delete-btn"
                                                onClick={() => handleDelete(workout._id)}
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="card-body">
                                        <div className="stat-badge">
                                            <span>Sets</span>
                                            <strong>{workout.sets}</strong>
                                        </div>
                                        <div className="stat-badge">
                                            <span>Reps</span>
                                            <strong>{workout.reps}</strong>
                                        </div>
                                        <div className="stat-badge">
                                            <span>Weight</span>
                                            <strong className="highlight">{workout.weight} kg</strong>
                                        </div>
                                    </div>

                                    <div className="card-footer">
                                        <div className="footer-date">
                                            <Calendar size={14} className="calendar-icon" />
                                            <span>{workout.date}</span>
                                        </div>
                                        <div className="footer-volume">
                                            <Scale size={13} />
                                            <span>{((Number(workout.sets) || 1) * (Number(workout.reps) || 0) * (Number(workout.weight) || 0)).toLocaleString()} kg volume</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WorkoutList;