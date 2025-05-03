import { useState } from 'react';
import { MessageService } from '../services/messageService.js';
import { Message } from '../models/Message.js';

export const useMessageController = () => {
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadConversation = async (userId) => {
        try {
            setLoading(true);
            setError(null);
            const data = await MessageService.getConversation(userId);
            setMessages(data.map(m => new Message(m)));
            setSelectedUser(userId);
        } catch (err) {
            setError('Failed to load conversation');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (content) => {
        if (!selectedUser) {
            setError('No user selected');
            return;
        }

        try {
            const newMessage = await MessageService.sendMessage({
                receiverId: selectedUser,
                content
            });
            setMessages(prev => [...prev, new Message(newMessage)]);
        } catch (err) {
            setError('Failed to send message');
            console.error(err);
        }
    };

    const updateMessage = async (messageId, newContent) => {
        try {
            const updatedMessage = await MessageService.updateMessage(messageId, {
                content: newContent
            });
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === messageId ? new Message(updatedMessage) : msg
                )
            );
        } catch (err) {
            setError('Failed to update message');
            console.error(err);
        }
    };

    const deleteMessage = async (messageId) => {
        try {
            await MessageService.deleteMessage(messageId);
            setMessages(prev =>
                prev.filter(msg => msg.id !== messageId)
            );
        } catch (err) {
            setError('Failed to delete message');
            console.error(err);
        }
    };

    return {
        messages,
        selectedUser,
        loading,
        error,
        loadConversation,
        sendMessage,
        updateMessage,
        deleteMessage,
        setError
    };
};
