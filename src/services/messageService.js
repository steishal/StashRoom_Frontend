import apiClient from '../Apiclient';

export const MessageService = {

    async sendMessage(messageData){
        const response = await apiClient.post('/messages', messageData);
        return response.data;
    },

    async updateMessage(messageId, messageData) {
        const response = await apiClient.put(`/messages/${messageId}`, messageData);
        return response.data;
    },

    async deleteMessage(messageId){
        await apiClient.delete(`/messages/${messageId}`);
    },

    async getConversation(userId, page = 1, limit = 20) {
        const response = await apiClient.get(`/messages/conversations/${userId}`, {
            params: { page, limit }
        });
        return {
            messages: response.data.messages,
            totalPages: response.data.totalPages
        };
    },

    async searchMessages(query, userId) {
        const response = await apiClient.get(`/messages/search`, {
            params: { query, userId }
        });
        return response.data;
    },

    async addReaction(messageId, reaction) {
        const response = await apiClient.post(`/messages/${messageId}/reactions`, { reaction });
        return response.data;
    },

    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        return await apiClient.post('/files/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
};
