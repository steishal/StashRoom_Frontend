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

    async generateTelegramToken() {
        const response = await apiClient.post("/users/telegram/generate-token");
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
    },

    async uploadAvatar(userId, file) {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('avatar', file);

        const response = await apiClient.post('/api/users/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data.avatar;
    },

    async searchUsers(query) {
        const response = await apiClient.get(`/api/users/search`, {
            params: { query }
        });
        return response.data;
    },

    async hasTelegramChatId(userId) {
        const response = await apiClient.get(`/users/${userId}/hasTelegramChatId`);
        return response.data;
    }
};

export default UserService;
