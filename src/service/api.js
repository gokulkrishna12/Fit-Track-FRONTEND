import axios from 'axios';

// Namma live Render backend URL-a baseURL ah set panrom 🔥
const API = axios.create({
    baseURL: 'https://fit-track-backend-02ef.onrender.com/api',
});

// Indha function ella request-kum munnadi auto-ah run aagum
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    // Token irundha, headers-la "Bearer <token>" ah add pannidum
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default API;

// Workout-a update panna PUT request function
export const updateWorkoutAPI = async (id, updatedData) => {
    const response = await API.put(`/workouts/${id}`, updatedData);
    return response.data;
};