import React, { useState } from 'react';
import { PlusCircle, Dumbbell, Hash, Scale, Calendar, Sparkles } from 'lucide-react';
import API from '../../service/api';
import './WorkoutForm.scss';

const quickExercises = [
    'Bench Press',
    'Barbell Squat',
    'Deadlift',
    'Incline Dumbbell Press',
    'Barbell Rows',
    'Overhead Shoulder Press'
];

const WorkoutForm = ({ onWorkoutAdded }) => {
    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        exerciseName: '',
        sets: '',
        reps: '',
        weight: '',
        date: today,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccessMsg('');
    };

    const handleSelectQuick = (name) => {
        setFormData({ ...formData, exerciseName: name });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            const response = await API.post('/workouts', {
                exerciseName: formData.exerciseName.trim(),
                sets: Number(formData.sets),
                reps: Number(formData.reps),
                weight: Number(formData.weight),
                date: formData.date
            });

            setFormData({
                exerciseName: '',
                sets: '',
                reps: '',
                weight: '',
                date: today,
            });

            setSuccessMsg('🔥 Workout logged successfully! Light weight!');
            setTimeout(() => setSuccessMsg(''), 3000);

            if (onWorkoutAdded) onWorkoutAdded(response.data);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add workout. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="workout-form-card">
            <div className="form-header">
                <div className="form-title-group">
                    <div className="form-icon-badge">
                        <Dumbbell size={22} />
                    </div>
                    <div>
                        <h3>Log New Workout</h3>
                        <p>Track your sets, reps, and iron volume.</p>
                    </div>
                </div>
            </div>

            {error && <div className="error-text">{error}</div>}
            {successMsg && <div className="success-text">{successMsg}</div>}

            {/* Quick Pick Pills */}
            <div className="quick-picks">
                <span className="quick-label">
                    <Sparkles size={12} /> Popular:
                </span>
                <div className="pills-scroll">
                    {quickExercises.map(ex => (
                        <button
                            type="button"
                            key={ex}
                            className={`quick-pill ${formData.exerciseName === ex ? 'active' : ''}`}
                            onClick={() => handleSelectQuick(ex)}
                        >
                            {ex}
                        </button>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="workout-form">
                <div className="form-row">
                    <div className="input-group">
                        <Dumbbell className="input-icon" size={18} />
                        <input
                            type="text"
                            name="exerciseName"
                            placeholder="Exercise Name (e.g., Incline Dumbbell Press)"
                            value={formData.exerciseName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group date-group">
                        <Calendar className="input-icon" size={18} />
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row triple">
                    <div className="input-group">
                        <Hash className="input-icon" size={18} />
                        <input
                            type="number"
                            name="sets"
                            placeholder="Sets (e.g., 4)"
                            min="1"
                            value={formData.sets}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Hash className="input-icon" size={18} />
                        <input
                            type="number"
                            name="reps"
                            placeholder="Reps (e.g., 10)"
                            min="1"
                            value={formData.reps}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Scale className="input-icon" size={18} />
                        <input
                            type="number"
                            name="weight"
                            placeholder="Weight in kg (e.g., 80)"
                            min="0"
                            step="0.5"
                            value={formData.weight}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="submit-workout-btn" disabled={loading}>
                    <PlusCircle size={20} />
                    {loading ? 'Saving Lift to Archives...' : 'Log Workout • Light Weight!'}
                </button>
            </form>
        </div>
    );
};

export default WorkoutForm;