import apiClient from "../apiClient.js";

export const AuthService = {
    async sendResetToken({ email, phone }) {
        const response = await apiClient.post('/auth/forgot-password', { email, phone });
        return response.data;
    },

    async login({ email, password }) {
        const response = await apiClient.post('/users/auth/login', { email, password });
        const token = response.headers['authorization']?.split(' ')[1];
        if (!token) {
            throw new Error('Токен авторизации не получен');
        }
        return { user: response.data, token };
    },

    async register({ email, password, username }) {
        await apiClient.post('/users/register', { email, password, username });
    },

    async resetPassword(token, newPassword) {
        const response = await fetch(`/api/auth/reset-password?token=${encodeURIComponent(token)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: newPassword,
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text);
        }

        return response;
    }
};
