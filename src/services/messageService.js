import apiClient from '../Apiclient';
import {Link} from "react-router-dom";
import React from "react";

export const MessageService = {

    async fetchAllConversations() {
        const response = await apiClient.get("/chats/all");
        return response.data;
    },

};

export default MessageService


export const fetchConversation = async (userId) => {
    try {
        const response = await  apiClient.get(`/messages/conversations/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching conversation:', error);
        throw error;
    }
};
