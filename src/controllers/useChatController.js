import { useState, useEffect, useCallback } from 'react';
import {
    connectWebSocket,
    sendMessage as wsSendMessage,
    updateMessage as wsUpdateMessage,
    deleteMessage as wsDeleteMessage,
    disconnectWebSocket
} from '../services/websocketService';
import { fetchConversation } from '../services/messageService';

export const useChatController = (selectedUserId) => {
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const handleIncomingMessage = useCallback((payload) => {
        console.log(" Incoming payload:", payload);
        setMessages(prev => {
            if (payload.type === 'NEW') {
                const tempIndex = prev.findIndex(m =>
                    m.tempId && m.tempId === payload.tempId
                );

                if (tempIndex !== -1) {
                    const updated = [...prev];
                    updated[tempIndex] = {
                        ...payload,
                        status: 'sent'
                    };
                    return updated;
                }
                return [...prev, { ...payload, status: 'sent' }];
            }

            if (payload.type === 'UPDATED') {
                return prev.map(m =>
                    m.id === payload.id
                        ? {
                            ...m,
                            content: payload.content,
                            isUpdating: false
                        }
                        : m
                );
            }
            if (payload.type === 'DELETED') {
                return prev.map(m =>
                    m.id === payload.id
                        ? {
                            ...m,
                            isDeleted: true,
                            isDeleting: false
                        }
                        : m
                );
            }

            return prev;
        });
    }, []);

    useEffect(() => {
        const initChat = async () => {
            try {
                setIsLoading(true);
                const userString = localStorage.getItem('user');
                if (!userString) throw new Error('User not found');

                const user = JSON.parse(userString);
                setCurrentUser({
                    id: user.id,
                    username: user.username
                });

                if (selectedUserId) {
                    const conversation = await fetchConversation(selectedUserId);
                    setMessages(conversation);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        initChat();
    }, [selectedUserId]);

    useEffect(() => {
        if (!currentUser?.id || !selectedUserId) return;

        const client = connectWebSocket(currentUser.id, handleIncomingMessage);

        return () => {
            disconnectWebSocket();
        };
    }, [currentUser, selectedUserId, handleIncomingMessage]);

    const sendMessage = useCallback((content) => {
        if (!content.trim()) return;

        const tempId = Date.now();
        const newMessage = {
            content,
            receiverId: selectedUserId,
            tempId,
            senderId: currentUser.id,
            senderUsername: currentUser.username,
            sentAt: new Date().toISOString(),
            status: 'sending'
        };

        setMessages(prev => [...prev, newMessage]);

        const success = wsSendMessage(newMessage);

        if (!success) {
            setMessages(prev => prev.map(m =>
                m.tempId === tempId
                    ? { ...m, status: 'error' }
                    : m
            ));
        }
    }, [currentUser, selectedUserId]);

    const editMessage = useCallback((messageId, newContent) => {
        setMessages(prev => prev.map(m =>
            m.id === messageId
                ? { ...m, content: newContent, isUpdating: true }
                : m
        ));

        wsUpdateMessage({
            id: messageId,
            content: newContent,
            receiverId: selectedUserId
        });
    }, [selectedUserId]);

    const deleteMessage = useCallback((messageId) => {
        setMessages(prev =>
            prev.map(m =>
                m.id === messageId
                    ? { ...m, isDeleted: true, isDeleting: true }
                    : m
            )
        );

        wsDeleteMessage({
            id: messageId,
            receiverId: selectedUserId
        });

    }, [selectedUserId]);


    useEffect(() => {
        const timer = setInterval(() => {
            setMessages(prev => prev.filter(m =>
                !(m.status === 'error' && Date.now() - Number(m.tempId) > 30000)
            ));
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    return {
        messages,
        currentUser,
        isLoading,
        error,
        sendMessage,
        editMessage,
        deleteMessage
    };
};