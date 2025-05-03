// api/services/userService.js
import apiClient from '../client';

export const UserService = {
    getCurrentUser: async () => {
        const response = await apiClient.get('/users/me');
        return response.data;
    },

    updateUser: async (id, userData) => {
        const response = await apiClient.put(`/users/${id}`, userData);
        return response.data;
    }
};