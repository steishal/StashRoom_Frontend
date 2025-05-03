import apiClient from '../Apiclient';

export const MessageService = {
    async getConversation(userId){
        const response = await apiClient.get(`/messages/conversations/${userId}`);
        return response.data;
    },

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
    }
};
