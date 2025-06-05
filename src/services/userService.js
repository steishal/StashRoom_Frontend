import apiClient from '../apiClient.js';

export const UserService = {
    async getCurrentUser(){
        const response = await apiClient.get('/users/me');
        return response.data;
    },

    async updateUser(id, userData){
        const response = await apiClient.put(`/users/${id}`, userData);
        return response.data;
    },

    async getUserById(id) {
        const response = await apiClient.get(`/users/${id}`);
        return response.data;
    },

    async getAvatar(userId) {
        const response = await apiClient.get(`/users/${userId}/avatar`);
        return response.data;
    },

    async getUserByUsername(username) {
        const response = await apiClient.get(`/users/username/${username}`);
        return response.data;
    },

    async register(userData) {
        const response = await apiClient.post('/register', userData);
        return response.data;
    },

    async login(userData) {
        const response = await apiClient.post('/auth/login', userData);
        const token = response.headers['authorization'];

        if (token) {
            localStorage.setItem('authToken', token);
        }

        return response.data;
    }
};
