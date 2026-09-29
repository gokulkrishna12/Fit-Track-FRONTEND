import axios from 'axios';

const API = axios.create({
    baseURL: 'https://fit-track-backend-02ef.onrender.com/api',
});


API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default API;

export const updateWorkoutAPI = async (id, updatedData) => {
    const response = await API.put(`/workouts/${id}`, updatedData);
    return response.data;
};